export default class TvSeriesType{
    tvSeriesId?: number;
    titleSrb?: string;
    titleEng?: string;
    director?: string;
    synopsis?: string;
    imageUrl?: string;
    categoryId  ?: number;
    genreId     ?: number;
    episodes?: {
        episodeId: number;
        titleSrb: string | null;
        titleEng: string | null;
        season: number;
        seasonEpisode: number;        
    }[];
    photoTvSeries?: {
        photoTvSeriesId: number;
        imagePath: string;
    }[];
    category?: {
        name: string;
    };
    genre?:{
        name: string | null;
    };

}