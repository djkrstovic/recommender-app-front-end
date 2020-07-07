export default class MovieType{
    movieId?: number;
    titleSrb?: string;
    titleEng?: string;
    director?: string;
    synopsis?: string;
    imageUrl?: string;
    categoryId  ?: number;
    genreId     ?: number;
    tags        ?: {
        tagId?: number;
    }[] | null;
}