export interface FortniteMap {
  patchVersion: string;
  releaseDate: string;
  url: string;
  urlPOI: string;
}

export interface POI {
  id: string;
  name: string;
  location: {
    x: number;
    y: number;
    z: number;
  };
}

export interface MapResponse {
  status: number;
  data: {
    images: {
      blank: string;
      pois: string;
    };
    pois: POI[];
  };
}
