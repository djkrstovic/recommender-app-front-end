import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import MovieType from '../../types/MovieType';
import ApiMoviesDto from '../../dtos/ApiMovies.dto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategories.dto';
import GenreType from '../../types/GenreType';
import ApiGenreDto from '../../dtos/ApiGenre.dto';

interface AdministratorDashboardMovieState{
	isAdministratorLoggedIn: boolean;
	movies: MovieType[];
	categories: CategoryType[];
	genres: GenreType[];

	addModal:{
		visible: boolean;
		message: string;
		titleEng: string;
		titleSrb: string;
		director: string;
		synopsis: string;
		categoryId: number | null;
		genreId: number | null;
		tags: {
			tagId: number;
			tagName: string;
		}[]
	};
	editModal:{
		visible: boolean;
		message: string;
		
		titleEng: string;
		titleSrb: string;
		director: string;
		synopsis: string;
		categoryId: number | null;
		genreId: number | null;
		tags: {
			tagId: number;
			tagName: string;
		}[]
	};
}

class AdministratorDashboardMovie extends React.Component {
	state: AdministratorDashboardMovieState;

	constructor(props: Readonly<{}>){
		super(props);

		this.state = {
			isAdministratorLoggedIn: true,
			movies: [],
			categories: [],
			genres: [],

			addModal:{
				visible: false,
				titleEng: '',
				titleSrb: '',
				director: '',
				synopsis: '',
				categoryId: 1,
				genreId: 1,
				message: '',
				tags:[],
			},
			editModal:{
				visible: false,
				titleEng: '',
				titleSrb: '',
				director: '',
				synopsis: '',
				categoryId: 1,
				genreId: 1,
				message: '',
				tags: [],	
			},
		}
	}

	private setAddModalVisibleState(newState: boolean){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				visible: newState,
			})
		));
	}

	private setAddModalStringFieldState(fieldName: string, newValue: string){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				[ fieldName ]: newValue,
			})
		));
	}

	private setAddModalNumberFieldState(fieldName: string, newValue: any){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				[ fieldName ]: (newValue==='null') ? null : Number(newValue),
			})
		));
	}
 
	private setEditModalVisibleState(newState: boolean){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				visible: newState,
			})
		));
	}

	private setEditModalStringFieldState(fieldName: string, newValue: string){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				[ fieldName ]: newValue,
			})
		));
	}

	private setEditModalNumberFieldState(fieldName: string, newValue: any){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				[ fieldName ]: (newValue==='null') ? null : Number(newValue),
			})
		));
	}

	componentDidMount(){
		this.getCategories();
		this.getGenre()
		this.getMovies();
	}

	private getCategories(){
		api('/api/category/', 'get', {}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === 'error' || res.status === 'login'){
				this.setLogginState(false);
				return;

			}
			this.putCategoriesInState(res.data);
		});
	}

	private putCategoriesInState(data: ApiCategoryDto[]){
		const categories: CategoryType[] = data.map(category => {
			return{
				categoryId: category.categoryId,
				name: category.name,
				items: [],
			};
		});

		this.setState(Object.assign(this.state, {
			categories: categories,
		}));
	}

	private getGenre(){

        api('api/genres/', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
				this.setLogginState(false);
				return;
			}

			this.putGenresInState(res.data);
        });
	}
	
	private putGenresInState(data: ApiGenreDto[]){
		const genres: GenreType[] = data.map(genre => {
			return{
				name: genre.name,
			};
		});

		const newState = Object.assign(this.state, {
			genres: genres,
		});

		this.setState(newState);
	}


    private getMovies(){

        api('api/movie/?join=tagMovies&join=tag&join=photoMovies&join=category&join=genre', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
				this.setLogginState(false);
				return;
			}

			this.putMoviesInState(res.data);
        });
	}
	
	private putMoviesInState(data: ApiMoviesDto[]){
		const movies: MovieType[] = data.map(movie => {
			return{
				movieId: movie.movieId,
				titleSrb: movie.titleSrb,
				titleEng: movie.titleEng,
				synopsis: movie.synopsis,
				director: movie.director,
				imageUrl: movie.photoMovies[0].imagePath,
				categoryId: movie.categoryId,
				genreId: movie.genreId,
				tagMovies: movie.tagMovies,
				tag: movie.tag,
				photoMovies: movie.photoMovies,
				category: movie.category,
				genre: movie.genre,
				items: [],
			};
		});
		this.setState(Object.assign(this.state, {
			movies: movies,
		}));
	}


	private setLogginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render(){

		if(this.state.isAdministratorLoggedIn === false){
			return(
				<Redirect to="/administrator/login"/>
			)
		}

        return (
			<Container>
				<RoledMainMenu role="administrator"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> Movies
                        </Card.Title>
						
						<Table hover size="sm" bordered>
							<thead>
								<tr>
									<th colSpan={7}></th>
									<th className="text-center">
										<Button variant="primary" size="sm"
										onClick={ ()=> this.showAddModal() }>
											<FontAwesomeIcon icon={ faPlus }/> Add
										</Button>
									</th>
								</tr>
								<tr>
									<th className="text-right">ID</th>
									<th>Title Eng</th>
									<th>Title Srb</th>
									<th>Director</th>
									<th>Synopsis</th>
									<th>Category</th>
									<th>Genre</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{ this.state.movies.map(movie => (
									<tr>
										<td className="text-right">{ movie.movieId }</td>
										<td className="text-right">{ movie.titleSrb }</td>
										<td className="text-right">{ movie.titleEng }</td>
										<td className="text-right">{ movie.director }</td>
										<td className="text-right">{ movie.synopsis }</td>
										<td className="text-right">{ movie.category?.name }</td>
										<td className="text-right">{ movie.genre?.name }</td>
										<td className="text-center">
											<Button variant="info" size="sm"
											onClick={ () => this.showEditModal(movie) }>
											<FontAwesomeIcon icon={ faEdit }/> Edit
											</Button></td>
										</tr>
								), this) }
							</tbody>
							
						</Table>


                    </Card.Body>
                </Card>


				<Modal size="lg" centered show={ this.state.addModal.visible } onHide={ ()=> this.setAddModalVisibleState(false) }>
					<Modal.Header closeButton>
						<Modal.Title>Add new Movie</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="add-titleSrb">Title Srb</Form.Label>
							<Form.Control id="add-titleSrb" type="text" value={ this.state.addModal.titleSrb }
								onChange={ (e)=> this.setAddModalStringFieldState('titleSrb', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="add-titleEng">Title Eng</Form.Label>
							<Form.Control id="add-titleEng" type="text" value={ this.state.addModal.titleEng }
								onChange={ (e)=> this.setAddModalStringFieldState('titleEng', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="add-synopsis">Synopsis</Form.Label>
							<Form.Control id="add-synopsis" as="textarea" rows={ 10 } value={ this.state.addModal.synopsis }
								onChange={ (e)=> this.setAddModalStringFieldState('synopsis', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="add-director">Director</Form.Label>
							<Form.Control id="add-director" type="text" value={ this.state.addModal.director }
								onChange={ (e)=> this.setAddModalStringFieldState('director', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="add-categoryId">Category</Form.Label>
							<Form.Control id="add-categoryId" as="select" value={ this.state.addModal.categoryId?.toString() }
								onChange={ (e)=> this.setAddModalNumberFieldState('categoryId', e.target.value)}>
									{ this.state.categories.map((category) => 
										<option value={ category.categoryId?.toString() }>
											{ category.name }
										</option>
									) }
								</Form.Control>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="add-genreId">Genre</Form.Label>
							<Form.Control id="add-genreId" as="select" value={ this.state.addModal.genreId?.toString() }
								onChange={ (e)=> this.setAddModalNumberFieldState('genreId', e.target.value)}>
									{ this.state.genres.map((genre) => 
										<option value={ genre.genreId?.toString() }>
											{ genre.name }
										</option>
									) }
								</Form.Control>
						</Form.Group>
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doAddMovie() } >
							<FontAwesomeIcon icon={ faPlus }/> Add new Movie
							</Button>
						</Form.Group>
						{ this.state.addModal.message ? (
							<Alert variant="danger" value= { this.state.addModal.message }/>
						) : '' }
					</Modal.Body>
				</Modal>
				
				
            </Container>
        );
	}
	private showAddModal(){
		this.setAddModalStringFieldState('titleSrb', '');
		this.setAddModalStringFieldState('titleEng', '');
		this.setAddModalStringFieldState('synopsis', '');
		this.setAddModalStringFieldState('director', '');
		this.setAddModalNumberFieldState('categoryId', 'null');
		this.setAddModalNumberFieldState('genreId', 'null');

		this.setAddModalStringFieldState('message', '');
		this.setAddModalVisibleState(true);
	}

	private doAddMovie(){
		api('api/movie/createFull/', 'post', {
			titleSrb: this.state.addModal.titleSrb,
			titleEng: this.state.addModal.titleEng,
			synopsis: this.state.addModal.synopsis,
			director: this.state.addModal.director,
			categoryId: this.state.addModal.categoryId,
			genreId: this.state.addModal.genreId,
		}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === "login"){
				this.setLogginState(false);
				return;
			}

			if(res.status === "error"){
				this.setAddModalStringFieldState('message', JSON.stringify(res.data));
				return;
			}

			this.setAddModalVisibleState(false);
			this.getMovies();
		})
	}
	private doEditMovie(){
		api('api/movie/', 'patch', {
			titleSrb: this.state.editModal.titleSrb,
			titleEng: this.state.editModal.titleEng,
			synopsis: this.state.editModal.synopsis,
			director: this.state.editModal.director,
			categoryId: this.state.editModal.categoryId,
			genreId: this.state.editModal.genreId,
		}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === "login"){
				this.setLogginState(false);
				return;
			}

			if(res.status === "error"){
				this.setEditModalStringFieldState('message', JSON.stringify(res.data));
				return;
			}

			this.setEditModalVisibleState(false);
			this.getMovies();
		})
	}

	private showEditModal(movie: MovieType){
		this.setEditModalStringFieldState('titleSrb', String(movie.titleSrb));
		this.setEditModalStringFieldState('titleEng', String(movie.titleEng));
		this.setEditModalStringFieldState('synopsis', String(movie.synopsis));
		this.setEditModalStringFieldState('director', String(movie.director));
		this.setEditModalNumberFieldState('categoryId', String(movie.categoryId));
		this.setEditModalNumberFieldState('genreId', String(movie.genreId));

		this.setEditModalStringFieldState('message', '');
		this.setEditModalVisibleState(true);
	}
	

}

export default AdministratorDashboardMovie;
