import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import TvSeriesType from '../../types/TvSeriesType';
import ApiTvSeriesDto from '../../dtos/ApiTvSeries.dto';
import ApiGenreDto from '../../dtos/ApiGenre.dto';
import GenreType from '../../types/GenreType';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategories.dto';

interface AdministratorDashboardTvSeriesState{
	isAdministratorLoggedIn: boolean;
	tvSeries: TvSeriesType[];
	categories: CategoryType[];
	genres: GenreType[];

	addModal:{
		visible: boolean;
		titleEng: string;
		titleSrb: string;
		director: string;
		synopsis: string;
		message: string;
		categoryId: number | null;
		genreId: number | null;
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
	};
}

class AdministratorDashboardTvSeries extends React.Component {
	state: AdministratorDashboardTvSeriesState;

	constructor(props: Readonly<{}>){
		super(props);

		this.state = {
			isAdministratorLoggedIn: true,
			tvSeries: [],
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
			},
		};
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
		this.getTvSeries();
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


    private getTvSeries(){

        api('api/series/?join=photoTvSeries&join=category&join=genrejoin=episode', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
				this.setLogginState(false);
				return;
			}

			this.putTvSeriesInState(res.data);
        });
	}
	
	private putTvSeriesInState(data: ApiTvSeriesDto[]){
		const tvSeries: TvSeriesType[] = data.map(series => {
			return{
				tvSeriesId: series.tvSeriesId,
				titleSrb: series.titleSrb,
				titleEng: series.titleEng,
				synopsis: series.synopsis,
				director: series.director,
				imageUrl: series.photoTvSeries[0].imagePath,
				categoryId: series.categoryId,
				genreId: series.genreId,
				photoTvSeries: series.photoTvSeries,
				category: series.category,
				genre: series.genre,
				items: [],
			};
		});

		const newState = Object.assign(this.state, {
			tvSeries: tvSeries,
		});

		this.setState(newState);
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
                        <FontAwesomeIcon icon={ faListAlt }/> TV Series
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
								{ this.state.tvSeries.map(series => (
									<tr>
										<td className="text-right">{ series.tvSeriesId }</td>
										<td className="text-right">{ series.titleEng }</td>
										<td className="text-right">{ series.titleSrb }</td>
										<td className="text-right">{ series.director }</td>
										<td className="text-right">{ series.synopsis }</td>
										<td className="text-right">{ series.category?.name }</td>
										<td className="text-right">{ series.genre?.name }</td>
										<td className="text-center">
											<Button variant="info" size="sm"
											onClick={ () => this.showEditModal(series) }>
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
						<Modal.Title>Add new TV Series</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="titleSrb">Title Srb</Form.Label>
							<Form.Control id="titleSrb" type="text" value={ this.state.addModal.titleSrb }
								onChange={ (e)=> this.setAddModalStringFieldState('titleSrb', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="titleEng">Title Eng</Form.Label>
							<Form.Control id="titleEng" type="text" value={ this.state.addModal.titleEng }
								onChange={ (e)=> this.setAddModalStringFieldState('titleEng', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="synopsis">Synopsis</Form.Label>
							<Form.Control id="synopsis" as="textarea" rows={ 10 } value={ this.state.addModal.synopsis }
								onChange={ (e)=> this.setAddModalStringFieldState('synopsis', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="director">Director</Form.Label>
							<Form.Control id="director" type="text" value={ this.state.addModal.director }
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
							<Button variant="primary" onClick={ () => this.doAddTvSeries() } >
							<FontAwesomeIcon icon={ faPlus }/> Add new TV Series
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

	private doAddTvSeries(){
		api('api/series/createFull/', 'post', {
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
			this.getTvSeries();
		})
	}
	private doEditTvSeries(){
		api('api/series/', 'patch', {
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
			this.getTvSeries();
		})
	}

	private showEditModal(series: TvSeriesType){
		this.setEditModalStringFieldState('titleSrb', String(series.titleSrb));
		this.setEditModalStringFieldState('titleEng', String(series.titleEng));
		this.setEditModalStringFieldState('synopsis', String(series.synopsis));
		this.setEditModalStringFieldState('director', String(series.director));
		this.setEditModalNumberFieldState('categoryId', String(series.categoryId));
		this.setEditModalNumberFieldState('genreId', String(series.genreId));

		this.setEditModalStringFieldState('message', '');
		this.setEditModalVisibleState(true);
	}

}

export default AdministratorDashboardTvSeries;
