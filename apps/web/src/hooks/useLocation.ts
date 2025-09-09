import { useState, useEffect } from 'react'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
  city?: string
  country?: string
}

interface LocationError {
  code: number
  message: string
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  // Check geolocation support
  const isSupported = 'geolocation' in navigator

  // Get current location
  const getCurrentLocation = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject({ code: 0, message: 'Geolocation is not supported by this browser' })
        return
      }

      setIsLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }

          // Try to get address from coordinates (reverse geocoding)
          try {
            const address = await reverseGeocode(locationData.latitude, locationData.longitude)
            locationData.address = address
          } catch (err) {
            console.warn('Failed to get address:', err)
          }

          setLocation(locationData)
          setPermission('granted')
          setIsLoading(false)
          resolve(locationData)
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: getErrorMessage(error.code)
          }
          
          setError(locationError)
          setPermission('denied')
          setIsLoading(false)
          reject(locationError)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=he,en`
      )
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()
      
      if (data.display_name) {
        return data.display_name
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Get error message based on error code
  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'הגישה למיקום נדחתה על ידי המשתמש'
      case 2:
        return 'מיקום לא זמין'
      case 3:
        return 'בקשת המיקום פגה'
      default:
        return 'שגיאה לא ידועה בקבלת המיקום'
    }
  }

  // Check permission status
  const checkPermission = async () => {
    if (!isSupported) return

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      setPermission(permission.state)
    } catch (err) {
      console.warn('Permission check failed:', err)
    }
  }

  // Request permission
  const requestPermission = async () => {
    try {
      await getCurrentLocation()
    } catch (error) {
      // Permission denied or error
    }
  }

  // Watch location changes
  const watchLocation = (callback: (location: LocationData) => void) => {
    if (!isSupported) return null

    return navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        callback(locationData)
      },
      (error) => {
        console.error('Location watch error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    )
  }

  // Stop watching location
  const stopWatching = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId)
  }

  // Check permission on mount
  useEffect(() => {
    checkPermission()
  }, [])

  return {
    location,
    error,
    isLoading,
    permission,
    isSupported,
    getCurrentLocation,
    calculateDistance,
    requestPermission,
    watchLocation,
    stopWatching
  }
}
