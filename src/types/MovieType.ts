export default class MovieType{
    movieId?: number;
    titleSrb?: string;
    titleEng?: string;
    director?: string;
    synopsis?: string;
    imageUrl?: string;
    categoryId  ?: number;
    genreId     ?: number;
    tagMovies?: {
        tagMoviesId: number;
        tagId: number;

    }[];
    tags?: {
        tagId: number;
        tagName: string;
    }[];
    photoMovies?: {
        photoMovieId: number;
        imagePath: string;
    }[];
    category?: {
        name: string;
    };
    genre?:{
        name: string | null;
    };
}