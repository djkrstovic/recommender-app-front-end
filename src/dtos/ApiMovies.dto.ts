export default interface ApiMoviesDto{
	movieId: number;
    titleSrb: string;
    titleEng: string;
    director: string;
    synopsis: string;
    imageUrl: string;
    categoryId  : number;
    genreId     : number;
    tagMovies: {                    // article_feature
        tagMoviesId: number;
        tagId: number;

    }[];
    tags: {                          // feature
        tagId: number;
        tagName: string;
    }[];
    photoMovies: {
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