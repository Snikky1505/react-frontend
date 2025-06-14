import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ArrowRight, FileText, Calendar, Globe, Database, User, Camera, Upload } from "lucide-react"
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from "axios";
import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/search_page.json";
import DataTable from "react-data-table-component";
import SearchInput from "./elements/SearchInput";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator2"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

function OSINTSearchPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const isCancelled = useRef(false);
  const [cseLoaded, setCseLoaded] = useState(false); // Track script loading status
  const scriptRef = useRef(null); // Ref untuk script CSE
  const [searchType, setSearchType] = useState("all")
  const searchRef = useRef<HTMLDivElement>(null)
  const handleCheck = async () => {
    if (!username) {
      alert("Username tidak boleh kosong!");
      return;
    }
    setLoading(true);
    setResults([]);
    setTotalSuccess(0);
    setTotalFailed(0);
    isCancelled.current = false;

    try {
      const urlList = `${baseUrl}/api/url-list`;
      const hit1 = await axios.get(urlList);
      const response2 = hit1.data.xdata;

      const requests = response2.map(async (item) => {
        const { name, uri_check } = item;
        const xurl = uri_check;
        const urlCheckUsername = `${baseUrl}/api/check-username`;
        try {
          const response = await axios.post(
            urlCheckUsername,
            {
              name,
              username,
              xurl,
            }
          );

          if (isCancelled.current) return;

          const siteData = response.data.sites[0];
          if (siteData.statusCode !== 200) {
            setTotalFailed((prev) => prev + 1);
            setResults((prev) => [...(prev || []), { ...siteData, status: "❌ Failed" }]);
          } else {
            setTotalSuccess((prev) => prev + 1);
            setResults((prev) => [...(prev || []), { ...siteData, status: "✅ Success" }]);
          }
        } catch (error) {
          console.error(`Failed to hit URL: ${xurl}`, error);
          if (isCancelled.current) return;
          setTotalFailed((prev) => prev + 1);
          setResults((prev) => [...(prev || []), { name, url: xurl, status: "❌ Failed" }]);
        }
      });
      
      setQuery(username);
      // if (cseLoaded) {
      //   const searchBox = document.querySelector("input.gsc-input");
      //   const searchButton = document.querySelector(".gsc-search-button");

      //   // Debugging apakah elemen input dan tombol pencarian ada
      //   console.log("Google Search Box:", searchBox);
      //   console.log("Google Search Button:", searchButton);

      //   if (searchBox && searchButton) {
      //     searchBox.value = query; // Set nilai input Google dengan query custom
      //     searchButton.click(); // Trigger pencarian
      //     console.log("Button Clicked!");
      //   } else {
      //     console.log("Google CSE elements are still not available.");
      //   }
      // } else {
      //   console.log("Google CSE script is still loading...");
      // }
      await Promise.allSettled(requests);
      // handleSearch()
    } catch (error) {
      console.error("Error checking username", error);
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    let searchQuery = query;

    // Modify query based on search type
    const socialSites = [
      "site:facebook.com",
      "site:instagram.com",
      "site:linkedin.com",
      "site:tiktok.com",
      "site:twitter.com OR site:x.com",
    ];

    if (searchType === "name") {
      searchQuery = `"${query}" (${socialSites.join(" OR ")})`;
    } else if (searchType === "content") {
      searchQuery = `${query} (${socialSites.join(" OR ")})`;
    } else {
      searchQuery = `${query} (${socialSites.join(" OR ")})`;
    }

    // Execute search using Google CSE
    if (window.google && window.google.search && window.google.search.cse) {
      const element = window.google.search.cse.element.getElement("searchresults-only0");
      if (element) {
        element.execute(searchQuery);
      }
    }
  };


  const handleStop = () => {
    isCancelled.current = true;
    setLoading(false);
  };

  const filteredResults = results?.filter(
    (result) => result.url && result.url.trim() !== ""
  ) || [];

  const columns = [
    {
      name: "URL",
      selector: (row) => row.url,
      sortable: true,
      cell: (row) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {row.url}
        </a>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => window.open(row.url, "_blank")}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Open Link
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // useEffect(() => {
  //    // Load Google CSE script
  //   const script = document.createElement("script")
  //   script.src = "https://cse.google.com/cse.js?cx=3545acb773e37469c"
  //   script.async = true
  //   script.onload = () => {
  //     setIsLoaded(true)
  //   }
  //   document.head.appendChild(script)

  //   return () => {
  //     // Cleanup
  //     const existingScript = document.querySelector('script[src*="cse.google.com"]')
  //     if (existingScript) {
  //       document.head.removeChild(existingScript)
  //     }
  //   }
  // },[]);


    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">OSINT Tools - Net Search</h1>
          <p className="text-gray-500">Manage your net Search using OSINT</p>
        </div>

        <div className="flex space-x-4 items-center justify-center">
          <input
            type="text"
            placeholder="Enter username"
            className="w-full max-w-md bg-white pl-8 h-10 rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleCheck} disabled={loading} className="bg-red-700 text-white rounded-lg px-4 py-2 hover:bg-red-300">
            {loading ? "Checking..." : "Search"}
          </button>
          <button onClick={handleStop} disabled={!loading} className="bg-red-700 text-white rounded-lg px-4 py-2 hover:bg-red-300">
            Stop
          </button>
        </div>
  
        {results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <label className="text-xl font-medium tracking-tight text-gray-500">
              Link Search Results:
            </label>
            <div className="mt-4 flex space-x-4 items-center justify-left">
              <p className="text-gray-500">
                <label className="font-medium text-green-500">Success:</label> {totalSuccess}
              </p>
              <p className="text-gray-500">
                <label className="font-medium text-red-500">Failed:</label> {totalFailed}
              </p>
            </div>
            <DataTable columns={columns} data={filteredResults} pagination />
          </div>
        )}
         {/* <div ref={searchRef}>
            <div className="gcse-searchresults-only" data-queryParameterName="search"></div>
          </div> */}
        <div className="rounded-lg border p-6">
          <div className="gcse-searchresults-only"></div>
        </div>
      </div>
    )
  }
  
  export default OSINTSearchPage
  
  