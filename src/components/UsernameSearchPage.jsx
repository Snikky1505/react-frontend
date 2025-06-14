import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ArrowRight, FileText, Calendar, Globe, Database, User, Camera, Upload } from "lucide-react"
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from "axios";
import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/search_page.json";


import PDFExportButton from "./ui/pdf-export-button-jspdf";
// import PDFExportButton from "./ui/pdfExportButton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"

import { Separator } from "../components/ui/separator2"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

function UsernameSearchPage({ onPointUpdated }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showCameraView, setShowCameraView] = useState(false);
  const [ButtonHideActive, setButtonHideActive] = useState(false);
  const [showbuttonHide, setShowButtonHide] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  const [searchMethod, setSearchMethod] = useState("text")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const maxLength = 150;


  const formatToIndonesianTime = (isoString) => {
    if (!isoString || isoString === "Unknown") return "Unknown";
  
    return format(new Date(isoString), "EEEE, dd MMMM yyyy HH:mm", { locale: id });
  };
  
  const handleCheck = async (query) => {
    const apiUrl = `${baseUrl}`;
    const paymentUrl = `${apiUrl}/api/payment`;
    const endpoints = [
      { url: "/api/nameScreening/search/dttot", source: "DTTOT" },
      { url: "/api/nameScreening/search/wmd", source: "WMD" },
      { url: "/api/nameScreening/search/judol", source: "JUDOL" },
      { url: "/api/nameScreening/search/sitpt", source: "SITPT" },
      { url: "/api/nameScreening/search/accuris", source: "Acuris" }, // kalau tetap mau dari sini juga
    ];
    setResults([]);
    setLoading(true);
    try {
      const paymentRes = await axios.post(paymentUrl, { 
        companyId: localStorage.getItem("companyId"),
        email: localStorage.getItem("email"),
        code: "NameScreeningFee"
       },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
       });
      const tx_id = paymentRes.data?.data?.txId;

      if (!tx_id) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Melakukan Pembayaran',
          text: 'tx_id tidak ditemukan. Silakan coba lagi.',
        });
        console.warn("Payment response:", paymentRes.data);
        return;
      }
      const requests = endpoints.map(({ url, source }) => {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        let data;
        if(query && query.length > 0){
          console.log("query:", query);
          data = { query, tx_id };
        }else{
          console.log("uploadedImage:", 'masuk');
          data = { image: uploadedImage, tx_id };
        }
  
        return axios.post(`${apiUrl}${url}`, data, { headers })
          .then((res) => ({
            source,
            data: res.data,
          }));
      });
      const results = await Promise.allSettled(requests);
      const mergedResults = results
      .flatMap((r) => {
        if (r.status !== "fulfilled") return [];
        const { value } = r;
        return (value.data ?? []).map((item) => ({
          name: item.entity_name?.trim() || "Unknown",
          id: item.entity_id || "Unknown",
          source: value.source,
          match: Math.round(item.similarity) || 0,
          dob: item.dob || "0000-00-00",
          // country: item.citizenship || "Unknown",
          country: item.citizenship || extractTags(item.country),
          tags: extractTags(item.category_status, item.category),
          image_path_enc: item.image_path_enc || "/user.png",
          details: {
            address: item.address || "Unknown",
            nationality: item.citizenship || "Unknown",
            occupation: item.occupation || "Unknown",
            riskLevel: item.risk_level || "High",
            lastUpdated: formatToIndonesianTime(item.updated_at || "Unknown"),
            additionalInfo: item.profile_notes || "No additional info",
            relatedEntities: item.related_entities || ["No Additional Related Entities"],
            identificationNumbers: item.identification_numbers || [{ type: "Passport", number: "NA" }],
            accurisAlias: item.alias || [],
            accurisAddress: item.acu_addr || [],
            accurisIndividualAsociation: item.individual_asociation || [],
            accurisIndividualBusinessAsociation: item.individual_business_asociation || [],
            accurisRRE: item.rre || [],
            accurisREL: item.rel || [],
            accurisSanction: item.sanction || [],
            accurisEvidence: item.evidence || [],
          },
        }));
      });

      setResults(mergedResults);
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Pencarian Berhasil',
        text: 'Hasil pencarian telah diperbarui.',
        confirmButtonColor:'#9D0712',
        confirmButtonText: `
          Continue&nbsp;<i class="fa fa-arrow-right"></i>
        `,
      });

      if (onPointUpdated) {
        await onPointUpdated();
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal menghubungi server. Silakan coba lagi.',
      });
      setResults([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    handleHideCamera();
  }

  const handleTakePhoto = () => {
    setShowCameraView(true);
    handleCameraCapture(); // Trigger capture
  };

  const handleCameraCapture = () => {
    if (!cameraActive) {
      setCameraActive(true); // ini akan trigger useEffect untuk nyalakan kamera
    } else {
      // Ambil snapshot seperti biasa
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const base64 = canvas.toDataURL("image/jpeg");
      setUploadedImage(base64);
  
      // Matikan kamera
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
      setCameraActive(false);
    }
  };
  

  const handleImageSearch = () => {
    // console.log("imageFile:", uploadedImage);
    const apiUrl = `${baseUrl}`;
    const endpoints = [
      { url: "/api/nameScreening/search/dttot", source: "DTTOT" },
      // { url: "/api/nameScreening/search/wmd", source: "WMD" },
      // { url: "/api/nameScreening/search/judol", source: "JUDOL" },
      // { url: "/api/nameScreening/search/sitpt", source: "SITPT" },
      // { url: "/api/nameScreening/search/accuris", source: "Acuris" }, // kalau tetap mau dari sini juga
    ];
    if (!uploadedImage) {
      console.warn("No file selected.");
      return;
    }

    const requests = endpoints.map(({ source }) => {
      const payload = {
        image: uploadedImage, // key yang dikirim
        tx_id: "kontlo",
      };

      return axios
        .post(`${apiUrl}/api/nameScreening/search/test-upload`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => ({
          source,
          data: res.data,
        }));
    });

    Promise.all(requests)
      .then((results) => {
        console.log("All responses:", results);
      })
      .catch((err) => {
        console.error("Upload failed:", err.response?.data);
      });
  }

  const handleOpenModal = (result) => {
    console.log(result);
    setSelectedResult(result)
    setIsModalOpen(true)
  }

  const handleExportPDF = () => {
    // In a real implementation, you would use a library like jsPDF or react-pdf
    // This is a placeholder for the PDF export functionality
    alert(`Exporting data for ${selectedResult.name} to PDF...`)

    // Simulate download delay
    setTimeout(() => {
      alert("PDF export completed!")
    }, 1500)
  }

  const extractTags = (...sources) => {
    const raw = sources.find(Boolean); // ambil sumber pertama yang ada nilainya
    if (!raw || typeof raw !== "string") return [];
  
    const tagList = raw
      .split(";")
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(tag => {
        const match = tag.match(/\(([^)]+)\)/); // ambil isi dalam kurung (misalnya SIP)
        return match ? match[1] : tag; // fallback kalau gak ada kurung
      });
  
    return [...new Set(tagList)];
  };
  
  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleSubmit = (e) => {
    handleCheck(query);
    setIsFilterOpen(false)
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // e.preventDefault(); // optional, mencegah submit form default
      handleSubmit();
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      console.log("Mengaktifkan kamera...");
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          console.log("Stream berhasil diterima");
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Gagal akses kamera:", err);
          alert("Tidak dapat mengakses kamera: " + err.message);
        });
    }
  }, [cameraActive]);

  const handleHideCamera = () => {
    setShowCameraView(false);
    setCameraActive(false);
    // Stop kamera jika aktif
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  
  const toggleText = () => setShowFullText(!showFullText);

  return (
    <div className="w-full mx-auto p-2">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Watchlist Name Screening</h1>
      </div>

      <Tabs value={searchMethod} onValueChange={setSearchMethod} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Text Search</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Image Search</span>
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="text" className="bg-gradient-to-r rounded-md from-black via-red-800 to-black p-6"> */}
        <TabsContent value="text">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
            {/* <div className="relative mb-6"> */}
            <Input placeholder="Cari berdasarkan Nama... [Nama], [Parameter tambahan berdasarkan Field]" value={query} className="pl-10 pr-4 h-12 text-gray-800" 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
            <Button
                variant="outline"
                className="text-sm bg-red-800 hover:bg-red-200 text-white gap-2 rounded-md h-12"
                onClick={handleSubmit}
              >
                <Search size={16} />
                Search
              </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-black">
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-red-800 text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFilters.length}
              </span>
            </Button>
            <div className="flex justify-start mb-4">
              <Button
                variant="outline"
                className="text-sm bg-red-800 hover:bg-red-200 text-white"
                onClick={() => setResults([])}
              >
                Clear Results
              </Button>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 text-black">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="px-3 py-1">
                  {filter}
                  <X size={14} className="ml-2 cursor-pointer" onClick={() => removeFilter(filter)} />
                </Badge>
              ))}
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])} className="text-xs">
                  Hapus Semua
                </Button>
              )}
            </div>
          )}

          {isFilterOpen && (
            <Card className="mb-6 mt-5 shadow-lg animate-in fade-in-50 slide-in-from-top-5 duration-300 text-black bg-white to-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filter Pencarian
                </CardTitle>
                <CardDescription>Sesuaikan parameter pencarian untuk hasil yang lebih spesifik</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Nama <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama"
                          className="w-full text-black"
                          required
                          onChange={() => addFilter("Nama")}
                        />
                      </div>

                      <div>
                        <label htmlFor="source" className="block text-sm font-medium mb-1">
                          Sumber
                        </label>
                        <Select onValueChange={() => addFilter("Sumber")}>
                          <SelectTrigger id="source" className="w-full text-black">
                            <SelectValue placeholder="Semua Sumber" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="all">Semua Sumber</SelectItem>
                              <SelectItem value="acuris">Acuris</SelectItem>
                              <SelectItem value="dttot">DTTOT</SelectItem>
                              <SelectItem value="wmd">WMD / DPPPSPM</SelectItem>
                              <SelectItem value="internal">Internal Watchlist</SelectItem>
                              <SelectItem value="gambling">Online Gambling</SelectItem>
                              <SelectItem value="sittp">SITPT</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Acuris, DTTOT, WMD / DPPPSPM, Internal Watchlist, Online Gambling, SITTP
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1">
                          Negara
                        </label>
                        <Select onValueChange={() => addFilter("Negara")}>
                          <SelectTrigger id="country" className="w-full text-black">
                            <SelectValue placeholder="Pilih Semua" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Pilih Semua</SelectItem>
                            <SelectItem value="id">Indonesia</SelectItem>
                            <SelectItem value="my">Malaysia</SelectItem>
                            <SelectItem value="sg">Singapura</SelectItem>
                            <SelectItem value="th">Thailand</SelectItem>
                            <SelectItem value="ph">Filipina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="birth-year" className="block text-sm font-medium mb-1">
                          Tahun Lahir (Opsional)
                        </label>
                        <Input
                          id="birth-year"
                          placeholder="Contoh: 1990"
                          className="w-full text-black"
                          onChange={() => addFilter("Tahun Lahir")}
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                          Kategori
                        </label>
                        <Select onValueChange={() => addFilter("Kategori")}>
                          <SelectTrigger id="category" className="w-full text-black">
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pep">PEP</SelectItem>
                            <SelectItem value="criminal">Kriminal</SelectItem>
                            <SelectItem value="terrorist">Teroris</SelectItem>
                            <SelectItem value="fraud">Penipuan</SelectItem>
                            <SelectItem value="other">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          *hanya untuk Sumber Individual Acuris, jika tidak ingin memilih kategori, biarkan dropdown tidak
                          dipilih
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsFilterOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="px-8">
                      Cari
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="image">
          <div className="space-y-4">
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium mb-2 text-black">Upload an image</h3>
                <p className="text-slate-500 mb-4">Drag and drop an image here, or click to select</p>
                {showCameraView && (
                  <div className="relative mb-4 bg-slate-100 rounded-md text-center">
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        className="m-auto w-100 h-100"
                      />
                    ) : (
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="m-auto w-100 h-100"
                      />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={triggerFileInput} variant="outline" className="flex items-center gap-2 text-white bg-red-800 hover:bg-red-200">
                    <Upload className="h-4 w-4" />
                    Browse Files
                  </Button>
                  <Button onClick={handleTakePhoto} variant="outline" className="flex items-center gap-2 bg-red-800 hover:bg-red-200 text-white">
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>

                  {cameraActive && (
                    <Button
                      onClick={handleHideCamera}
                      variant="outline"
                      className="px-4 py-2 bg-red-800 text-white"
                    >
                      Hide
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Uploaded Image</h3>
                  <Button variant="ghost" size="icon" onClick={clearUploadedImage} className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative aspect-video mb-4 bg-slate-100 rounded-md overflow-hidden">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded2"
                    className="m-auto w-140 h-100"
                  />
                  
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                <Button
                  onClick={handleCheck}
                  className="w-full bg-red-800 hover:bg-red-200 hover:text-black text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search with this image
                </Button>
              </div>
              
            )}
          </div>

        </TabsContent>
      </Tabs>

      {/* Placeholder for results */}
      <div className="border bg-gradient-to-r from-black via-red-800 to-black border-gray-300 shadow-sm rounded-lg p-8 text-center text-muted-foreground">
        {/* <p>Hasil pencarian akan ditampilkan di sini</p> */}
        <div className="space-y-4">
          {loading && (
            <div className="loading-overlay">
              <Lottie
                animationData={loadingAnimation}
                loop
                style={{ width: 300, height: 100 }}
                className="mx-auto"
              />
              <p style={{ fontWeight: 'bold' }} className="text-white">
                Memproses pencarian...
              </p>
            </div>
          )}

          {!loading && results.length > 0 ? (
            results.map((result, index) => (
              <Card key={index} className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={result.image_path_enc || "/user.png"} alt={result.name} />
                              <AvatarFallback>{result.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          <div>
                            <h2 className="text-xl font-bold text-black">{result.name}</h2>
                            <p className="text-slate-500 text-sm text-left">ID: {result.id}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant={tag === "PEP" ? "secondary" : "destructive"}
                                className={`
                                  px-3 py-1 font-medium 
                                  ${
                                    tag === "PEP"
                                      ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                                      : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                  }
                                `}
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 text-left gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Source</p>
                          <p className="font-bold text-black">{result.source}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Match</p>
                          <p className="font-medium text-red-800">{result.match}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Date of Birth</p>
                          <p className="font-medium text-black">{result.dob}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Country</p>
                          <p className="font-medium text-black">{result.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center bg-red-50 p-4 md:p-0 md:w-16">
                      <Button
                        variant="link"
                        size="icon"
                        className="rounded-full h-10 w-10 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        // onClick={() => setModalOpen(true)}
                        onClick={() => handleOpenModal(result)}

                      >
                        <ArrowRight className="h-5 w-5" />
                        <span className="sr-only">View details</span>
                      </Button>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            ))
          ) : !loading && results.length === 0 ? (
            <p className="text-white text-center">Tidak ada hasil pencarian yang ditemukan</p>
          ) : null}
        </div>
      </div>
      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 text-black">
              <User className="h-5 w-5 text-emerald-600" />
              {selectedResult?.name}
            </DialogTitle>
            <DialogDescription>
              ID: {selectedResult?.id} • Source: {selectedResult?.source}
            </DialogDescription>
          </DialogHeader>
          {selectedResult && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                    <img
                      src={selectedResult.image_path_enc || "/placeholder.svg"}
                      alt={selectedResult.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedResult.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant={tag === "PEP" ? "secondary" : "destructive"}
                        className={`
                          px-3 py-1 font-medium 
                          ${
                            tag === "PEP"
                              ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          }
                        `}
                      >
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {selectedResult.match}% Match
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-slate-700">Date of Birth</h3>
                        <p className="text-slate-600">{selectedResult.dob}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-slate-700">Country / Nationality</h3>
                        <p className="text-slate-600">
                          {selectedResult.country} / {selectedResult.details.nationality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Database className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-slate-700">Source / Last Updated</h3>
                        <p className="text-slate-600">
                          {selectedResult.source} / {selectedResult.details.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-slate-700 mb-1">Address</h3>
                      <p className="text-slate-600">{selectedResult.details.address}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-700 mb-1">Occupation</h3>
                      <p className="text-slate-600">{selectedResult.details.occupation}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-slate-700 mb-2">Identification Numbers</h3>
                <div className="space-y-2">
                  {selectedResult.details.identificationNumbers.map((id, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-50 text-black">
                        {id.type}
                      </Badge>
                      <span className="text-slate-600">{id.number}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-700 mb-2">Related Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.details.relatedEntities.map((entity, idx) => (
                    <Badge key={idx} variant="outline" className="bg-slate-50 text-black">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-700 mb-2">Additional Information</h3>
                <p className="text-slate-600">
                  {/* {selectedResult.details.additionalInfo} */}
                  {/* {info = selectedResult.details.additionalInfo} */}
                  {showFullText || selectedResult.details.additionalInfo.length <= maxLength
                  ? selectedResult.details.additionalInfo
                  : selectedResult.details.additionalInfo.substring(0, maxLength) + '...'}
                </p>
                {selectedResult.details.additionalInfo.length > maxLength && (
                  <button
                    onClick={toggleText}
                    className="text-blue-600 hover:underline mt-1"
                  >
                    {showFullText ? 'Show less' : 'Show more'}
                  </button>
                )}        
              </div>
            </div>
          )}
          <DialogFooter className="flex sm:justify-between flex-col sm:flex-row gap-3">
            <Button className="text-red-500 hover:text-red-600 hover:bg-red-50" variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <PDFExportButton selectedResult={selectedResult} fileName={`sijitu-report-${selectedResult?.id}`} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsernameSearchPage;
