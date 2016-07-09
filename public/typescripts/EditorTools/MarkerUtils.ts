export interface MarkerMeta{
    title?: string;
    key: string;
    tags: string[];
    args?: string;
}

export interface Marker{
    start: number;
    end?: number;
    meta: MarkerMeta;
    color?: string;//formatted rgba()
    img?: string;
}

export class MarkerFactory{
    public static createMarker(meta: MarkerMeta, start:number) : Marker{
        return {
            start: start,
            meta: meta
        }
    }
    public static createMarkerDefault(start: number) : Marker{
        return {
            start: start,
            meta: MarkerFactory.createDefaultMarkerMeta()
        }
    }
    public static dateString(){
        return new Date().toLocaleString();
    }
    public static createDefaultMarkerMeta(): MarkerMeta{
        return {
            key: MarkerFactory.dateString(),
            tags: []
        }
    }
}