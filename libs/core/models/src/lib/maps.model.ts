export interface FortniteMap {
  patchVersion: string;
  releaseDate: string;
  url: string;
  urlPOI: string;
}

export interface POI {
  id: string
  name: string
  x: number
  y: number
  images: string[]
}
