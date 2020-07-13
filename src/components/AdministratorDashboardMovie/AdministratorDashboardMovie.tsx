import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Col, Row } from 'react-bootstrap';
import { faListAlt, faEdit, faPlus, faSave, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import MovieType from '../../types/MovieType';
import ApiMoviesDto from '../../dtos/ApiMovies.dto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategories.dto';
import GenreType from '../../types/GenreType';
import ApiGenreDto from '../../dtos/ApiGenre.dto';
import ApiTagsDto from '../../dtos/ApiTags.dto';
import TagType from '../../types/TagType';

interface AdministratorDashboardMovieState{
	isAdministratorLoggedIn: boolean;
	movies: MovieType[];
	categories: CategoryType[];
	genres: GenreType[];
	tags: TagType[];

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
			tagName: string;
			use: number;
			tagId: number;
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
			tagName: string;
			use: number;
			tagId: number;
		}[]
	};
}
	
	interface TagBaseType{
		tagId: number;
		tagName: string;
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
			tags: [],

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

	private setAddModalTagUse(tagId: number, use: boolean){
		const addTags: {tagId: number; use: number; }[] = [...this.state.addModal.tags];
		for(const tag of addTags){
			if(tag.tagId === tagId){
				tag.use = use ? 1 : 0;
				break;
			}
		}

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				tags: addTags,
			}),
		));
	}
	private setAddModalTagValue(tagId: number, tagName: string){
		const addTags: {tagId: number; tagName: string; }[] = [...this.state.addModal.tags];
		for(const tag of addTags){
			if(tag.tagId === tagId){
				tag.tagName = tagName;
				break;
			}
		}

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				tags: addTags,
			}),
		));
	}
	private setEditModalTagUse(tagId: number, use: boolean){
		const editTags: {tagId: number; use: number; }[] = [...this.state.editModal.tags];
		for(const tag of editTags){
			if(tag.tagId === tagId){
				tag.use = use ? 1 : 0;
				break;
			}
		}

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				tags: editTags,
			}),
		));
	}
	private setEditModalTagValue(tagId: number, tagName: string){
		const editTags: {tagId: number; tagName: string; }[] = [...this.state.editModal.tags];
		for(const tag of editTags){
			if(tag.tagId === tagId){
				tag.tagName = tagName;
				break;
			}
		}

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				tags: editTags,
			}),
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
		this.getGenre();
		this.getTags();
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
	private getTags(){
		api('/api/tags/', 'get', {}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === 'error' || res.status === 'login'){
				this.setLogginState(false);
				return;

			}
			this.putTagsInState(res.data);
		});
	}

	private putTagsInState(data: ApiTagsDto[]){
		const tags: TagType[] = data.map(tag => {
			return{
				tagName: tag.tagName,
			};
		});

		this.setState(Object.assign(this.state, {
			tags: tags,
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

	private async getTagsByMovieId(movieId: number): Promise<TagBaseType[]>{
		return new Promise(resolve =>{
			api('/api/tags/?filter=movieId||$eq||' + movieId + '/', 'get', {}, 'administrator')
			.then((res: ApiResponse) => {
				if(res.status === "error" || res.status === "login"){
					this.setLogginState(false);
					return resolve([]);
				}

				const tags: TagBaseType[] = res.data.map((item: any) => ({
					 tagId: item.tagId,
					 tagName: item.tagName,
				}));

				resolve(tags);
        	});
		})
		
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
				tags: movie.tags,
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
	
	private async addModalMovieChanged(event: React.ChangeEvent<HTMLSelectElement>){
		this.setAddModalNumberFieldState('movieId', event.target.value);

		const tags = await this.getTagsByMovieId(Number(event.target.value));
		const stateTags = tags.map(tag => ({
			tagId: tag.tagId,
			tagName: tag.tagName,
			use: 0,
		}));

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				tags: stateTags,
			}),
		));
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
									<th colSpan={8}></th>
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
									<th>Tags</th>
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
										<td className="text-right">{ movie.tags }</td>
										<td className="text-right">{ movie.genre?.name }</td>
										<td className="text-center">
											<Link to={"/administrator/dashboard/photoMovies/" + movie.movieId}
											className="btn btn-sm btn-dark">
												<FontAwesomeIcon icon={ faImages }/> Photos
											</Link>
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


				<Modal size="lg" centered show={ this.state.addModal.visible } 
				onHide={ ()=> this.setAddModalVisibleState(false) }
				onEntered= { () => {
					if(document.getElementById('add-photoMovie')) {
						const filePicker: any = document.getElementById('add-photoMovie')
						filePicker.value = '';
						} 
					} }>
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
							<Form.Label htmlFor="add-tagId">Tags</Form.Label>
							<Form.Control id="add-tagId" as="select" value={ this.state.addModal.tags?.toString() }
								onChange={ (e)=> this.setAddModalNumberFieldState('tagId', e.target.value)}>
									{ this.state.tags.map((tag) => 
										<option value={ tag.tagId?.toString() }>
											{ tag.tagName }
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

						<div>
							{ this.state.addModal.tags.map(this.printAddModalTagInput ,this) }
						</div>

						<Form.Group>
							<Form.Label htmlFor="add-photoMovie">Photo</Form.Label>
							<Form.File id="add-photoMovie"/>
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


				<Modal size="lg" centered show={ this.state.editModal.visible } 
				onHide={ ()=> this.setEditModalVisibleState(false) }>
					<Modal.Header closeButton>
						<Modal.Title>Edit Movie</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="edit-titleSrb">Title Srb</Form.Label>
							<Form.Control id="edit-titleSrb" type="text" value={ this.state.editModal.titleSrb }
								onChange={ (e)=> this.setEditModalStringFieldState('titleSrb', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="edit-titleEng">Title Eng</Form.Label>
							<Form.Control id="edit-titleEng" type="text" value={ this.state.editModal.titleEng }
								onChange={ (e)=> this.setEditModalStringFieldState('titleEng', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="edit-synopsis">Synopsis</Form.Label>
							<Form.Control id="edit-synopsis" as="textarea" rows={ 10 } value={ this.state.editModal.synopsis }
								onChange={ (e)=> this.setEditModalStringFieldState('synopsis', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="edit-director">Director</Form.Label>
							<Form.Control id="edit-director" type="text" value={ this.state.editModal.director }
								onChange={ (e)=> this.setEditModalStringFieldState('director', e.target.value)}/>
						</Form.Group>
						
						<Form.Group>
							<Form.Label htmlFor="edit-tagId">Tags</Form.Label>
							<Form.Control id="edit-tagId" as="select" value={ this.state.editModal.tags?.toString() }
								onChange={ (e)=> this.setEditModalNumberFieldState('tagId', e.target.value)}>
									{ this.state.tags.map((tag) => 
										<option value={ tag.tagId?.toString() }>
											{ tag.tagName }
										</option>
									) }
								</Form.Control>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="edit-genreId">Genre</Form.Label>
							<Form.Control id="edit-genreId" as="select" value={ this.state.editModal.genreId?.toString() }
								onChange={ (e)=> this.setEditModalNumberFieldState('genreId', e.target.value)}>
									{ this.state.genres.map((genre) => 
										<option value={ genre.genreId?.toString() }>
											{ genre.name }
										</option>
									) }
								</Form.Control>
						</Form.Group>

						<div>
							{ this.state.editModal.tags.map(this.printEditModalTagInput ,this) }
						</div>

						
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doEditMovie() } >
							<FontAwesomeIcon icon={ faSave }/> Edit Movie
							</Button>
						</Form.Group>
						{ this.state.editModal.message ? (
							<Alert variant="danger" value= { this.state.editModal.message }/>
						) : '' }
					</Modal.Body>
				</Modal>
				
				
            </Container>
        );
	}

	private printAddModalTagInput(tag: any){
		return(
			
			<Form.Group>
				<Row>
					<Col xs="4" sm="1" className="text-center">
					<input type="checkbox" value="1" checked={ tag.use === 1}
						onChange= { (e) => this.setAddModalTagUse(tag.tagId, e.target.checked) } />
					</Col>
					<Col xs="8" sm="3">
						{ tag.tagName }
					</Col>
					<Col xs="12" sm="8">
						<Form.Control type="text" value={ tag.tagName }
							onChange={ (e) => this.setAddModalTagValue(tag.tagId, e.target.value) }/>
					</Col>
				</Row>
				
				
				
			</Form.Group>
		);
	}
	private printEditModalTagInput(tag: any){
		return(
			
			<Form.Group>
				<Row>
					<Col xs="4" sm="1" className="text-center">
					<input type="checkbox" value="1" checked={ tag.use === 1}
						onChange= { (e) => this.setEditModalTagUse(tag.tagId, e.target.checked) } />
					</Col>
					<Col xs="8" sm="3">
						{ tag.tagName }
					</Col>
					<Col xs="12" sm="8">
						<Form.Control type="text" value={ tag.tagName }
							onChange={ (e) => this.setEditModalTagValue(tag.tagId, e.target.value) }/>
					</Col>
				</Row>
				
				
				
			</Form.Group>
		);
	}
	private showAddModal(){
		this.setAddModalStringFieldState('titleSrb', '');
		this.setAddModalStringFieldState('titleEng', '');
		this.setAddModalStringFieldState('synopsis', '');
		this.setAddModalStringFieldState('director', '');
		this.setAddModalNumberFieldState('categoryId', 'null');
		this.setAddModalNumberFieldState('tagId', 'null');
		this.setAddModalNumberFieldState('genreId', 'null');

		this.setAddModalStringFieldState('message', '');

		

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				tags: [],
			}),
		));

		this.setAddModalVisibleState(true);

		
	}

	private doAddMovie(){
		const filePicker: any = document.getElementById('add-photoMovie');

		if(filePicker?.files.length===0){
			this.setAddModalStringFieldState('message', 'You must select a file to upload.')
		}

		api('/api/movie/', 'post', {
			titleSrb: this.state.addModal.titleSrb,
			titleEng: this.state.addModal.titleEng,
			synopsis: this.state.addModal.synopsis,
			director: this.state.addModal.director,
			categoryId: this.state.addModal.categoryId,
			tags: this.state.addModal.tags
			.filter(tag=>tag.use === 1)
			.map(tag=>({
				tagId: tag.tagId,
				tagName: tag.tagName,
			})),
			genreId: this.state.addModal.genreId,
		}, 'administrator')
		.then(async (res: ApiResponse) => {
			if(res.status === "login"){
				this.setLogginState(false);
				return;
			}

			if(res.status === "error"){
				this.setAddModalStringFieldState('message', JSON.stringify(res.data));
				return;
			}

			const movieId: number = res.data.movieId;
			
			const file = filePicker.files[0];
			await this.uploadMoviePhoto(movieId, file);

			

			this.setAddModalVisibleState(false);
			this.getMovies();
		})
	}

	private async uploadMoviePhoto(movieId: number, file: File){
		return await apiFile('/api/movie/' + movieId + '/upload-photo/', 'photo', file, 'administrator');
	}
	private doEditMovie(){
		api('/api/movie/', 'patch', {
			titleSrb: this.state.editModal.titleSrb,
			titleEng: this.state.editModal.titleEng,
			synopsis: this.state.editModal.synopsis,
			director: this.state.editModal.director,
			categoryId: this.state.editModal.categoryId,
			tagId: this.state.editModal.tags,
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

	private async showEditModal(movie: MovieType){
		this.setEditModalStringFieldState('message', '');
		this.setEditModalStringFieldState('titleSrb', String(movie.titleSrb));
		this.setEditModalStringFieldState('titleEng', String(movie.titleEng));
		this.setEditModalStringFieldState('synopsis', String(movie.synopsis));
		this.setEditModalStringFieldState('director', String(movie.director));
		this.setEditModalNumberFieldState('categoryId', String(movie.categoryId));
		this.setEditModalNumberFieldState('movieId', String(movie.movieId));
		this.setEditModalNumberFieldState('genreId', String(movie.genreId));
		// this.setEditModalNumberFieldState('tags', String(movie.tags));

		if(!movie.movieId){
			return;
		}

		const movieId: number = movie.movieId;


		const allTags: any[] = await this.getTagsByMovieId(movieId);

		for(const apiTag of allTags){

			apiTag.use =0;
			apiTag.tagName = '';

			if(!movie.tags){
				continue;
			}

			for(const tagMovie of movie.tags){
				if(tagMovie.tagId === apiTag.tagId){
					apiTag.use =1;
					apiTag.tagName = tagMovie.tagName;
				}
			}
		}

		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				tags: allTags,
			}),
		));

		this.setEditModalVisibleState(true);
	}
	

}

export default AdministratorDashboardMovie;
