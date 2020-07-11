import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import CategoryType from "../../types/CategoryType";
import MovieType from '../../types/MovieType';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from '../../config/api.config';
import TvSeriesType from '../../types/TvSeriesType';


interface CategoryPageProperties{
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState{
    isUserLoggedIn: boolean;
    category?: CategoryType;
    movies?: MovieType[];
    tvSeries?: TvSeriesType[];
    message: string;
}

interface MovieDto{
    movieId?: number;
    titleSrb?: string;
    titleEng?: string;
    director?: string;
    synopsis?: string;
    photoMovies?: {
        imagePath: string;
    };
    categoryId?: number;
    genreId?: number;
    tagMovies?: {
        tagId?: number;
    }[] | null;
}

// SERIJE
interface TvSeriesDto{
    tvSeriesId?: number;
    titleSrb?: string;
    titleEng?: string;
    director?: string;
    synopsis?: string;
    photoTvSeries?: {
        imagePath: string;
    };
    categoryId?: number;
    genreId?: number;
}





export default class CategoryPage extends React.Component <CategoryPageProperties>{
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>){
        super(props);

        this.state = { 
            isUserLoggedIn: true,
            message: '',
        };
    }

    //SERIJE
    private setTvSeries(tvSeries: TvSeriesType[]){
        const newState = Object.assign(this.state, {
            tvSeries: tvSeries,
        });

        this.setState(newState);
    }

    private showTvSeries(){
        if(this.state.tvSeries?.length ===0){
            return(
                <div>There are no tv series to show.</div>
            );
        }

        return(
            <Row>
                { this.state.tvSeries?.map(this.singleTvSeries) }
            </Row>
        )
    }

    private singleTvSeries(tvSeries: TvSeriesType){
        return(
            <Col lg="6" md="6" sm="6" xs="12">
				<Card className="mb-3 h-100">
                    <Card.Header>
                        <img alt={ tvSeries.titleEng } src={ ApiConfig.PHOTO_PATH_TV_SERIES + 'small/' + tvSeries.imageUrl }/>
                    </Card.Header>
					<Card.Body>
						<Card.Title className="text-left"> {tvSeries.titleSrb} </Card.Title>
						<Card.Title className="text-left"> {tvSeries.titleEng} </Card.Title>
						<Card.Title className="text-left" as="p"> Director:<b><i> {tvSeries.director} </i></b></Card.Title>
                        Synopsis: 
                        <Card.Text>
                            { tvSeries.synopsis }
                        </Card.Text>
						<Link to={`/movie/${ tvSeries.tvSeriesId }`}
							className="btn btn-primary btn-block btn-sm">
							Open tv series page
						</Link>
					</Card.Body>
				</Card>
			</Col>
        )
    }



    //////////////////////////////////////////////////////////////////////////////////

    private setLogginState(isLoggedIn: boolean){
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setMessage(message: string){
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }
    private setMovies(movies: MovieType[]){
        const newState = Object.assign(this.state, {
            movies: movies,
        });

        this.setState(newState);
    }

    private setCategoryData(category: CategoryType){

        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    render(){

        if(this.state.isUserLoggedIn === false){
			return(
				<Redirect to="/user/login"/>
			)
        }
        
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faFilm }/> { this.state.category?.name }
                        </Card.Title>
                            { this.printOptionalMessage() }
                            { this.showMovies() }
                            { this.showTvSeries() }
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    

    private printOptionalMessage(){
        if(this.state.message === ''){
            return;
        }
            return(
                <Card.Text>
                    { this.state.message }
                </Card.Text>
            );
        
    }

    componentDidMount(){
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties){
        if(oldProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData();
    }

    private showMovies(){
        if(this.state.movies?.length ===0){
            return(
                <div>There are no movies to show.</div>
            );
        }

        return(
            <Row>
                { this.state.movies?.map(this.singleMovie) }
            </Row>
        )
    }

    private singleMovie(movies: MovieType){
        return(
            <Col lg="6" md="6" sm="6" xs="12">
				<Card className="mb-3 h-100">
                    <Card.Header>
                        <img alt={ movies.titleEng } src={ ApiConfig.PHOTO_PATH_MOVIE + 'small/' + movies.imageUrl }/>
                    </Card.Header>
					<Card.Body>
						<Card.Title className="text-left"> {movies.titleSrb} </Card.Title>
						<Card.Title className="text-left"> {movies.titleEng} </Card.Title>
						<Card.Title className="text-left" as="p">Director: <b><i> {movies.director} </i></b></Card.Title>
                        <Card.Text>
                            { movies.synopsis }
                        </Card.Text>
						<Link to={`/movie/${ movies.movieId }`}
							className="btn btn-primary btn-block btn-sm">
							Open movie page
						</Link>
					</Card.Body>
				</Card>
			</Col>
        )
    }

    private getCategoryData(){
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if(res.status === 'login'){
                return this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error. Please try to refresh the page. ERROR: ');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);
        });
        if('api/category/' + this.props.match.params.cId === 'api/category/1'){
        api('api/movie/', 'get' ,{
            movieId: 1,
            titleSrb: "",
            titleEng: "",
            director: "",
            synopsis: "",
            categoryId: this.props.match.params.cId,
            genreId: 0,
            photoMovies: "",
        }).then((res: ApiResponse)=>{
            if(res.status === 'login'){
                return this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            const movies: MovieType[]=
            res.data.map((movies: MovieDto)=> {
                const object: MovieType = {
                    movieId: movies.movieId,
                    titleSrb: movies.titleSrb,
                    titleEng: movies.titleEng,
                    director: movies.director,
                    synopsis: movies.synopsis,
                    imageUrl: '',
                    categoryId: movies.categoryId,
                    genreId: movies.genreId,
                    tags: [],
                }

                
                return object;

            });

            this.setMovies(movies);
        });
    }else if('api/category/' + this.props.match.params.cId === 'api/category/2'){
        api('api/series/', 'get' ,{
            tvSeriesId: 1,
            titleSrb: "",
            titleEng: "",
            director: "",
            synopsis: "",
            categoryId: this.props.match.params.cId,
            genreId: 0,
            photoTvSeries: "",
        }).then((res: ApiResponse)=>{
            if(res.status === 'login'){
                return this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            const tvSeries: TvSeriesType[]=
            res.data.map((tvSeries: TvSeriesDto)=> {
                const object: TvSeriesType = {
                    tvSeriesId: tvSeries.tvSeriesId,
                    titleSrb: tvSeries.titleSrb,
                    titleEng: tvSeries.titleEng,
                    director: tvSeries.director,
                    synopsis: tvSeries.synopsis,
                    imageUrl: '',
                    categoryId: tvSeries.categoryId,
                    genreId: tvSeries.genreId,
                }

                
                return object;

            });

            this.setTvSeries(tvSeries);
        });
    }

    }
}