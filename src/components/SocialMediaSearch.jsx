import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Search } from "lucide-react"

const SEARCH_ENGINE_ID = "3545acb773e37469c"

const socialMediaPlatforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    site: "linkedin.com",
    color: "bg-blue-600",
    icon: "💼",
  },
  {
    id: "facebook",
    name: "Facebook",
    site: "facebook.com",
    color: "bg-blue-500",
    icon: "📘",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    site: "twitter.com OR site:x.com",
    color: "bg-black",
    icon: "🐦",
  },
  {
    id: "instagram",
    name: "Instagram",
    site: "instagram.com",
    color: "bg-pink-500",
    icon: "📷",
  },
  {
    id: "tiktok",
    name: "TikTok",
    site: "tiktok.com",
    color: "bg-red-500",
    icon: "🎵",
  },
]

export default function SocialMediaSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [currentSearchUrl, setCurrentSearchUrl] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handlePlatformChange = (platformId, checked) => {
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, platformId])
    } else {
      setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId))
    }
  }

  const constructSearchUrl = (query, platforms) => {
    let searchTerms = query

    if (platforms.length > 0) {
      const siteParams = platforms
        .map((platformId) => {
          const platform = socialMediaPlatforms.find((p) => p.id === platformId)
          return platform ? `site:${platform.site}` : ""
        })
        .filter(Boolean)
        .join(" OR ")

      searchTerms = `${query} (${siteParams})`
    }

    const params = new URLSearchParams({
      cx: SEARCH_ENGINE_ID,
      q: searchTerms,
    })

    // return `https://cse.google.com/cse?${params.toString()}`
    return `/google.html?${params.toString()}`
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const searchUrl = constructSearchUrl(searchQuery, selectedPlatforms)
    setCurrentSearchUrl(searchUrl)
    setShowResults(true)
  }

  const handleQuickSearch = (platformId) => {
    if (!searchQuery.trim()) return

    const searchUrl = constructSearchUrl(searchQuery, [platformId])
    setCurrentSearchUrl(searchUrl)
    setShowResults(true)
  }

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Pencarian Media Sosial dengan Google CSE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Instructions */}
            <Card className="bg-white text-black">
                <CardHeader className="p-3">
                <CardTitle className="text-lg">Cara Penggunaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-600 p-3 pt-0">
                <p>1. Masukkan kata kunci yang ingin dicari</p>
                <p>2. Pilih platform media sosial yang ingin dicari (opsional)</p>
                <p>3. Klik tombol "Cari" atau tombol platform spesifik</p>
                <p>4. Hasil pencarian akan terbuka di tab baru menggunakan Google CSE</p>
                <p className="font-medium text-blue-600">
                    💡 Tip: Jika tidak memilih platform, pencarian akan dilakukan di seluruh web
                </p>
                </CardContent>
            </Card>
          {/* Search Input */}
          <div className="space-y-2">
            <label>Kata Kunci Pencarian</label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Masukkan kata kunci pencarian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="text-md">
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <label>Pilih Platform Media Sosial</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {socialMediaPlatforms.map((platform) => (
                <div key={platform.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) =>
                        handlePlatformChange(platform.id, checked)
                      }
                    />
                    <label
                      className="text-sm font-medium cursor-pointer flex items-center gap-1"
                    >
                      <span>{platform.icon}</span>
                      {platform.name}
                    </label>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleQuickSearch(platform.id)}
                    disabled={!searchQuery.trim()}
                    className="w-full text-md"
                  >
                    Cari di {platform.name} {platform.icon}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Search All Platforms */}
          <div className="flex justify-center">
            <Button
              onClick={() => {
                const allIds = socialMediaPlatforms.map((p) => p.id)
                setSelectedPlatforms(allIds)
                const searchUrl = constructSearchUrl(searchQuery, allIds)
                setCurrentSearchUrl(searchUrl)
                setShowResults(true)
              }}
              disabled={!searchQuery.trim()}
              variant="default"
              size="lg"
              className="text-md"
            >
              Cari di Semua Platform
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embedded Search Results */}
      {showResults && currentSearchUrl && (
        <Card className="bg-white text-black">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Hasil Pencarian</CardTitle>
            <Button className="bg-red-800" size="sm" onClick={() => setShowResults(false)}>
              Tutup Hasil
            </Button>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[700px] border rounded-lg overflow-hidden">
              <iframe
                src={currentSearchUrl}
                className="w-full h-full"
                frameBorder="0"
                title="Google Custom Search Results"
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <p>URL Pencarian: {currentSearchUrl}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
