export default interface ApiMoviesDto{
	movieId: number;
    titleSrb: string;
    titleEng: string;
    director: string;
    synopsis: string;
    imageUrl: string;
    categoryId  : number;
    genreId     : number;
}