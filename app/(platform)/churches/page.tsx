"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ChurchLocation } from "@/types"
import {
  Calendar,
  Church,
  GlobeIcon,
  Mail,
  MapPin,
  Navigation,
} from "lucide-react"
import type { GlobeMethods } from "react-globe.gl"
import * as THREE from "three"

import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { useChurchLocations } from "@/hooks/use-church-locations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false })

export default function ChurchesPage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined)
  const { locations, isLoading } = useChurchLocations()
  const [selected, setSelected] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [search, setSearch] = useState("")

  const points = locations
    .filter(
      (loc: ChurchLocation) =>
        loc.latitude &&
        loc.longitude &&
        !isNaN(Number(loc.latitude)) &&
        !isNaN(Number(loc.longitude)) &&
        loc.id !== undefined &&
        loc.address
    )
    .map((loc: ChurchLocation) => ({
      ...loc,
      lat: Number(loc.latitude),
      lng: Number(loc.longitude),
      name: loc.address,
    }))

  const filteredPoints = points.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  )

  // Pan globe to selected church
  useEffect(() => {
    if (globeEl.current && points[selected]) {
      globeEl.current.pointOfView(
        {
          lat: points[selected].lat,
          lng: points[selected].lng,
          altitude: 0.5,
        },
        1000
      )
    }
  }, [selected, points])

  // Add clouds only once on mount
  useEffect(() => {
    let animationFrameId: number | null = null
    let clouds: THREE.Mesh | null = null

    function addClouds() {
      if (
        !globeEl.current ||
        !globeEl.current.scene() ||
        !globeEl.current.getGlobeRadius()
      ) {
        animationFrameId = requestAnimationFrame(addClouds)
        return
      }

      const CLOUDS_IMG_URL = "/images/clouds.png"
      const CLOUDS_ALT = 0.004
      const CLOUDS_ROTATION_SPEED = -0.006

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
        clouds = new THREE.Mesh(
          new THREE.SphereGeometry(
            globeEl.current!.getGlobeRadius() * (1 + CLOUDS_ALT),
            75,
            75
          ),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
        )
        globeEl.current!.scene().add(clouds!)

        function rotateClouds() {
          if (clouds) {
            clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180
            animationFrameId = requestAnimationFrame(rotateClouds)
          }
        }
        rotateClouds()
      })
    }

    addClouds()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (clouds && globeEl.current?.scene()) {
        globeEl.current.scene().remove(clouds)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || hasUserInteracted || points.length === 0) return

    const interval = setInterval(() => {
      setSelected(prev => (prev + 1) % points.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoRotating, hasUserInteracted, points.length])

  // Stop auto-rotation when user interacts
  useEffect(() => {
    if (hasUserInteracted) setIsAutoRotating(false)
  }, [hasUserInteracted])

  function handlePointClick(point: object) {
    setHasUserInteracted(true)
    const churchPoint = point as ChurchLocation
    const idx = points.findIndex(p => p.id === churchPoint.id)
    if (idx !== -1) setSelected(idx)
  }

  function handleCardClick(idx: number) {
    setHasUserInteracted(true)
    setSelected(idx)
  }

  function handleVisitClick(church: ChurchLocation, event: React.MouseEvent) {
    event.stopPropagation()
    const googleMapsUrl = `https://www.google.com/maps?q=${church.latitude},${church.longitude}`
    window.open(googleMapsUrl, "_blank")
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(new Date(date))
  }

  if (isLoading) return <LoadingState />

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex flex-col lg:flex-row h-screen'>
        {/* Globe section */}
        <div className='flex-1 relative min-h-[50vh] lg:min-h-0 bg-gradient-to-br from-muted/20 to-background'>
          <div className='overflow-hidden absolute inset-0'>
            {points.length > 0 && (
              <Globe
                ref={globeEl}
                globeImageUrl='/images/globe.jpg'
                pointsData={points}
                pointLat='lat'
                pointLng='lng'
                pointAltitude={0.1}
                pointLabel='name'
                backgroundColor='rgba(0,0,0,0)'
                onPointClick={handlePointClick}
                pointRadius={0.2}
                pointColor={() => "rgba(34,197,94,0.9)"}
                bumpImageUrl='//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png'
              />
            )}
          </div>

          {points[selected] && (
            <div className='absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-auto z-10 lg:max-w-sm'>
              <Card className='bg-card/95 backdrop-blur-md border shadow-xl'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-2'>
                    <div className='p-1.5 rounded-md bg-primary/10'>
                      <MapPin className='h-4 w-4 text-primary' />
                    </div>
                    <Badge variant='secondary' className='text-xs font-medium'>
                      Selected Location
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <h3 className='font-semibold text-lg mb-2 leading-tight'>
                    {points[selected].name}
                  </h3>
                  <p className='text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed'>
                    {points[selected].description}
                  </p>
                  <div className='space-y-3 mb-4'>
                    {points[selected].email && (
                      <div className='flex items-center gap-3 text-sm'>
                        <div className='p-1 rounded bg-muted'>
                          <Mail className='h-3 w-3 text-muted-foreground' />
                        </div>
                        <span className='truncate text-muted-foreground'>
                          {points[selected].email}
                        </span>
                      </div>
                    )}
                    <div className='flex items-center gap-3 text-sm'>
                      <div className='p-1 rounded bg-muted'>
                        <Calendar className='h-3 w-3 text-muted-foreground' />
                      </div>
                      <span className='text-muted-foreground'>
                        Added {formatDate(points[selected].createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    onClick={e => handleVisitClick(points[selected], e)}
                    className='w-full gap-2 font-medium'
                  >
                    <Navigation className='h-4 w-4' />
                    Visit on Maps
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Church locations sidebar */}
        <div className='w-full lg:w-[420px] bg-card/30 backdrop-blur-sm border-t lg:border-t-0 lg:border-l flex flex-col h-[50vh] lg:h-full'>
          {/* Header - Fixed */}
          <div className='p-4 lg:p-6 border-b bg-card/50 flex-shrink-0'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10'>
                  <Church className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h2 className='text-xl font-semibold'>Our Locations</h2>
                  <p className='text-sm text-muted-foreground'>
                    Click to explore each community
                  </p>
                </div>
              </div>
              <Badge variant='outline' className='font-medium'>
                {filteredPoints.length}
              </Badge>
            </div>
            {/* Search input */}
            <div className='mt-2'>
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search church name...'
                className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition placeholder:text-muted-foreground shadow-sm'
                autoFocus={false}
              />
            </div>
          </div>

          {/* Scrollable content */}
          <div className='flex-1 min-h-0 overflow-hidden'>
            <div className='h-full overflow-y-auto overscroll-contain'>
              <div className='p-3 lg:p-4 space-y-2'>
                {filteredPoints.length === 0 ? (
                  <div className='text-center text-muted-foreground text-sm py-8'>
                    No churches found.
                  </div>
                ) : (
                  filteredPoints.map(church => {
                    // Find the index in the original points array for selection
                    const originalIdx = points.findIndex(
                      p => p.id === church.id
                    )
                    return (
                      <Card
                        key={church.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                          selected === originalIdx
                            ? "ring-2 ring-primary/20 bg-primary/5 border-primary/30 shadow-md"
                            : "hover:shadow-md hover:bg-accent/30 border-border/50"
                        }`}
                        onClick={() => handleCardClick(originalIdx)}
                      >
                        <CardContent className='p-3'>
                          <div className='flex gap-3'>
                            {/* Smaller image */}
                            <div className='relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border'>
                              {church.imageUrl ? (
                                <Image
                                  src={
                                    isTigrisUrl(church.imageUrl)
                                      ? getProxiedImageUrl(church.imageUrl)
                                      : church.imageUrl
                                  }
                                  alt={church.name}
                                  fill
                                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center bg-muted'>
                                  <Church className='h-5 w-5 text-muted-foreground' />
                                </div>
                              )}
                            </div>

                            <div className='flex-1 min-w-0 space-y-2'>
                              {/* Title and description */}
                              <div>
                                <h3 className='font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors'>
                                  {church.name}
                                </h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 leading-tight'>
                                  {church.description}
                                </p>
                              </div>

                              {/* Compact info grid */}
                              <div className='grid grid-cols-1 gap-1'>
                                <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                  <MapPin className='h-2.5 w-2.5 flex-shrink-0' />
                                  <span className='truncate font-mono text-[10px]'>
                                    {church.latitude}, {church.longitude}
                                  </span>
                                </div>

                                {church.email && (
                                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                    <Mail className='h-2.5 w-2.5 flex-shrink-0' />
                                    <span className='truncate text-[10px]'>
                                      {church.email}
                                    </span>
                                  </div>
                                )}

                                <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                  <Calendar className='h-2.5 w-2.5 flex-shrink-0' />
                                  <span className='text-[10px]'>
                                    Added {formatDate(church.createdAt)}
                                  </span>
                                </div>
                              </div>

                              {/* Compact button */}
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={e => handleVisitClick(church, e)}
                                className='w-full mt-2 gap-1.5 font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs h-7'
                              >
                                <Navigation className='h-2.5 w-2.5' />
                                Visit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='flex flex-col lg:flex-row h-screen'>
        <div className='flex-1 relative min-h-[50vh] lg:min-h-0 bg-gradient-to-br from-muted/20 to-background'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='relative'>
                <div className='animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary mx-auto'></div>
                <GlobeIcon className='h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
              </div>
              <div className='space-y-2'>
                <p className='text-lg font-medium'>Loading Interactive Globe</p>
                <p className='text-sm text-muted-foreground'>
                  Preparing church locations...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full lg:w-[420px] bg-card/30 backdrop-blur-sm border-t lg:border-t-0 lg:border-l flex flex-col h-[50vh] lg:h-full'>
          <div className='p-4 lg:p-6 border-b bg-card/50 flex-shrink-0'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10'>
                  <Church className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h2 className='text-xl font-semibold'>Our Locations</h2>
                  <p className='text-sm text-muted-foreground'>
                    Loading locations...
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <Input
                placeholder='Search church name...'
                className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground'
                disabled
              />
            </div>
          </div>
          <div className='flex-1 min-h-0 overflow-hidden'>
            <div className='p-4'>
              <div className='text-center py-8'>
                <div className='animate-pulse space-y-4'>
                  <div className='h-4 bg-muted rounded w-3/4 mx-auto'></div>
                  <div className='h-4 bg-muted rounded w-1/2 mx-auto'></div>
                  <div className='h-4 bg-muted rounded w-2/3 mx-auto'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
