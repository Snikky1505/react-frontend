"use client"

import { useState, useRef, useEffect } from "react"
import {
Search,
Shield,
Eye,
Users,
MapPin,
Clock,
AlertTriangle,
CheckCircle,
XCircle,
Globe,
Mail,
Phone,
Calendar,
} from "lucide-react"
import axios from "axios";
import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/search_page.json";

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export default function OSINTDashboard() {
const [searchQuery, setSearchQuery] = useState("")
const [isSearching, setIsSearching] = useState(false)
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
const [breachedSources, setBreachedSources] = useState([]);
const [socialProfiles, setSocialProfiles] = useState([]);

const handleSearch = async () => {
    const apiUrl = `${baseUrl}`;
    const url = `${apiUrl}/api/osint-search`;
    setLoading(true);
    try{
        const searchOsint = await axios.post(`${url}`, { 
        query: query,
        });
        // const result = searchOsint;
        setResults(searchOsint.data);
        setBreachedSources(searchOsint.data.data.flatMap((item) => ({
            name: item.platform_name?.trim() || "Unknown",
            icon: getIconByName(item.platform_name || "Unknown"),
            records: item.record_count || 0,
        })));
        setSocialProfiles( searchOsint.data.data.flatMap((item) =>
            item.osint_search_details.map((detail) => ({
                platform: item.platform_name?.trim() || "Unknown",
                username: detail.username || "Unknown",
                followers: detail.followers || "N/A",
                connections: detail.connections || "N/A",
                repositories: detail.repositories || "N/A",
            }))
        ));
        setLoading(false);  
    }catch(error) {
        console.error("Error during API call:", error);
            setLoading(false);
            Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            text: 'Gagal menghubungi server. Silakan coba lagi.',
            });
            setResults([]);
    }
    // Simulate search delay
    // return axios.post(`${apiUrl}${url}`, data, { headers })
    //         .then((res) => ({
    //             source,
    //             data: res.data,
    //         }));
    // setTimeout(() => setIsSearching(false), 2000)
}

const iconMap = {
    linkedin: '💼',
    facebook: '📘',
    twitter: '🐦',
    instagram: '📸',
    github: '🐱',
    youtube: '📹',
    tiktok: '🎵',
    reddit: '👾',
    pinterest: '📌',
    snapchat: '👻',
    whatsapp: '💬',
    telegram: '📱',
    quora: '❓',
    tumblr: '🌐',
    medium: '📝',
    stackoverflow: '💻',
    wordpress: '🖋️',
    adobe: '🎨',
    dropbox: '📦',
    lastpass: '🔐'
};

function getIconByName(name) {
    return iconMap[name.toLowerCase()] || '❓';
}
// const breachedSources = [
// { name: "LinkedIn", icon: "💼", severity: "high", records: 700000000 },
// { name: "Facebook", icon: "📘", severity: "critical", records: 533000000 },
// { name: "Twitter", icon: "🐦", severity: "medium", records: 330000000 },
// { name: "Adobe", icon: "🎨", severity: "high", records: 153000000 },
// { name: "Dropbox", icon: "📦", severity: "medium", records: 68000000 },
// { name: "LastPass", icon: "🔐", severity: "critical", records: 30000000 },
// ]

// setSocialProfiles([
// { platform: "Twitter", username: "@johndoe", verified: true, followers: "12.5K" },
// { platform: "LinkedIn", username: "john-doe-dev", verified: true, connections: "500+" },
// { platform: "GitHub", username: "johndoe", verified: false, repos: "47" },
// { platform: "Instagram", username: "john.doe", verified: false, followers: "2.1K" },
// ]);

const locationData = [
{ city: "San Francisco", country: "USA", confidence: 95, source: "IP Geolocation" },
{ city: "New York", country: "USA", confidence: 78, source: "Social Media" },
{ city: "London", country: "UK", confidence: 45, source: "Email Headers" },
]

const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        // e.preventDefault(); // optional, mencegah submit form default
        handleSearch();
    }
};
return (
<div className="min-h-screen bg-[#210000] text-white">
    {/* Header */}
    <header className="border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            {/* <Shield className="h-8 w-8 text-blue-500" /> */}
            {/* <span className="text-2xl font-bold">
                </span> */}
                <img src="/public/sijitu-white.png" width="200px" height="100px" />  
        </div>
        {/* <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors">
            Dashboard
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
            Search
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
            Reports
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
            API
            </a>
        </nav> */}
        <div className="flex items-center space-x-4">
            {/* <Badge variant="outline" className="text-white border-white bg-black">
            Credits: 1,250
            </Badge> */}
            <div className="relative p-2 rounded-md text-white flex items-center gap-2">
                <div className="group relative">
                <i className="fas fa-coins"></i>
                </div>
                <span className="font-bold text-md"> Credits : 1.250</span>
            </div>
            <Button variant="outline" size="sm" className="bg-black ">
            Account
            </Button>
        </div>
        </div>
    </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 py-8">
    {/* Search Section */}
    <div className="mb-8">
        <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Advanced OSINT Intelligence Platform</h1>
        <p className="text-gray-400 text-center mb-8">
            Decode the noise. Discover what matters.
        </p>
        <div className="flex space-x-2">
            <Input
            placeholder="Enter email, username, phone, or domain..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-950 border-gray-900 text-white placeholder-gray-400"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="bg-red-800 hover:bg-red-600">
            {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
                <Search className="h-4 w-4" />
            )}
            </Button>
        </div>
        </div>
    </div>

    {/* Main Dashboard */}

    {/* <Tabs defaultValue="breaches" className="space-y-6">
        <TabsList className="bg-gray-950 border-gray-900 text-white">
        <TabsTrigger value="breaches" className="data-[state=active]:bg-gray-800">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Summary ({breachedSources.length})
        </TabsTrigger>
        <TabsTrigger value="social" className="data-[state=active]:bg-gray-800">
            <Users className="h-4 w-4 mr-2" />
            Social Profiles ({socialProfiles.length})
        </TabsTrigger>
        <TabsTrigger value="location" className="data-[state=active]:bg-gray-800">
            <MapPin className="h-4 w-4 mr-2" />
            Location Data ({locationData.length})
        </TabsTrigger>
        </TabsList>

        <TabsContent value="breaches">
            <Card className="bg-gray-950 border-gray-900">
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span>Summary of Discovered Data</span>
                    <Badge variant="destructive">{breachedSources.length} discovered data</Badge>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {breachedSources.map((source, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">{source.icon}</div>
                            <div>
                            <h3 className="font-semibold">{source.name}</h3>
                            
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{source.records.toLocaleString()} records exposed</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="social">
        <Card className="bg-gray-950 border-gray-900">
            <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>Social Media Profiles</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {socialProfiles.map((profile, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>{profile.platform[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center space-x-2">
                        <span className="font-semibold">{profile.platform}</span>
                        {profile.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                        </div>
                        <p className="text-sm text-gray-400">{profile.username}</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className="text-sm font-medium">
                        {profile.followers || profile.connections || profile.repos}
                    </p>
                    <p className="text-xs text-gray-400">
                        {profile.followers ? "followers" : profile.connections ? "connections" : "repositories"}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="location">
        <Card className="bg-gray-950 border-gray-900">
            <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <span>Location Intelligence</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {locationData.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-blue-400" />
                    <div>
                        <h3 className="font-semibold">
                        {location.city}, {location.country}
                        </h3>
                        <p className="text-sm text-gray-400">Source: {location.source}</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <Badge
                        variant={
                        location.confidence > 80 ? "default" : location.confidence > 60 ? "secondary" : "secondary"
                        }
                    >
                        {location.confidence}% confidence
                    </Badge>
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="verification">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-950 border-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Identity Verification</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span>Email Verification</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span>Phone Verification</span>
                </div>
                <XCircle className="h-4 w-4 text-red-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>Social Media Consistency</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
            </CardContent>
            </Card>

            <Card className="bg-gray-950 border-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Timeline Analysis</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <div>
                    <p className="text-sm font-medium">First Seen</p>
                    <p className="text-xs text-gray-400">March 15, 2019</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded">
                    <Calendar className="h-4 w-4 text-green-400" />
                    <div>
                    <p className="text-sm font-medium">Last Activity</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <div>
                    <p className="text-sm font-medium">Last Breach</p>
                    <p className="text-xs text-gray-400">January 8, 2024</p>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        </TabsContent>
    </Tabs> */}

    <div className="space-y-4 text-center mb-10">
        {loading && (
            <div className="loading-overlay">
                <Lottie
                animationData={loadingAnimation}
                loop
                style={{ width: 300, height: 100 }}
                className="mx-auto"
                />
                <p style={{ fontWeight: 'bold' }} className="text-white">
                Searching Process...
                </p>
            </div>
        )}
    </div>

    {(breachedSources.length > 0 || socialProfiles.length > 0) && (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-950 border-gray-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Data Found</p>
                        <p className="text-2xl font-bold text-red-400">{results?.dashboard?.data_found}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                </CardContent>
                </Card>
                <Card className="bg-gray-950 border-gray-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Total Search</p>
                        <p className="text-2xl font-bold text-blue-400">{results?.dashboard?.total_searches}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                    </div>
                </CardContent>
                </Card>
                <Card className="bg-gray-950 border-gray-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Most Frequent Keywords</p>
                        <p className="text-2xl font-bold text-green-400">{results?.dashboard?.most_name_search}</p>
                    </div>
                    <Search className="h-8 w-8 text-green-400" />
                    </div>
                </CardContent>
                </Card>
            </div>


            {/* Tabs for Breaches and Social Media */}
            <Tabs defaultValue="breaches">
                <TabsList className="bg-gray-950 border-gray-900 text-white">
                    <TabsTrigger value="breaches" className="data-[state=active]:bg-gray-800">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Summary ({breachedSources.length})
                    </TabsTrigger>
                    <TabsTrigger value="social" className="data-[state=active]:bg-gray-800">
                        <Users className="h-4 w-4 mr-2" />
                        Social Profiles ({socialProfiles.length})
                    </TabsTrigger>
                    <TabsTrigger value="location" className="data-[state=active]:bg-gray-800">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location Data ({locationData.length})
                    </TabsTrigger>
                </TabsList>
                {/* Breaches */}
                {breachedSources.length > 0 && (
                <TabsContent value="breaches">
                    <Card className="bg-gray-950 border-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span>Summary of Discovered Data</span>
                        <Badge variant="destructive">{breachedSources.length} discovered data</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {breachedSources.map((source, index) => (
                            <Card key={index} className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                <div className="text-2xl">{source.icon}</div>
                                <div>
                                    <h3 className="font-semibold">{source.name}</h3>
                                </div>
                                </div>
                                <p className="text-sm text-gray-400">
                                {source.records.toLocaleString()} records exposed
                                </p>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
                )}

                {/* Social Media */}
                {/* {socialProfiles.length > 0 && ( */}
                <TabsContent value="social">
                    <Card className="bg-gray-950 border-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span>Social Media Profiles</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {socialProfiles.map((profile, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                    <AvatarFallback>{profile.platform[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">{profile.platform}</span>
                                        {profile.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                                    </div>
                                    <p className="text-sm text-gray-400">{profile.username}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                    {profile.followers || profile.connections || profile.repos}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                    {profile.followers ? "followers" : profile.connections ? "connections" : "repositories"}
                                    </p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
                 {/* )} */}

                 <TabsContent value="location">
                    <Card className="bg-gray-950 border-gray-900">
                        <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-green-400" />
                            <span>Location Intelligence</span>
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="space-y-4">
                            {locationData.map((location, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                                <div className="flex items-center space-x-3">
                                <Globe className="h-8 w-8 text-blue-400" />
                                <div>
                                    <h3 className="font-semibold">
                                    {location.city}, {location.country}
                                    </h3>
                                    <p className="text-sm text-gray-400">Source: {location.source}</p>
                                </div>
                                </div>
                                <div className="text-right">
                                <Badge
                                    variant={
                                    location.confidence > 80 ? "default" : location.confidence > 60 ? "secondary" : "secondary"
                                    }
                                >
                                    {location.confidence}% confidence
                                </Badge>
                                </div>
                            </div>
                            ))}
                        </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
        
    )}
    </main>
</div>
)}
