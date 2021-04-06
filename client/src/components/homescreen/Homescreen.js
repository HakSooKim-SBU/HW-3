import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, UpdateListItems_Transaction, 
	ReorderItems_Transaction, EditItem_Transaction ,
	SortItems_Transaction} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const [hasUndo, toggleHasUndo] 	= useState(false);
	const [hasRedo, toggleHasRedo] 	= useState(false);


	

	
	const [ChangeTodolistsTop] 		= useMutation(mutations.CHANGE_TODOLISTS_TOP);

	const [SortByColumn] 			= useMutation(mutations.SORT_BY_COLUMN);
	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);


	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;

	// const keyPressHandler = async () => {
		window.onkeydown = async (event) => {
			// alert("hey")
			if((event.key === "z" || event.key ==="Z") && event.ctrlKey){
				tpsRedo();
			}
			else if((event.key === "y" || event.key ==="Y") && event.ctrlKey){
				tpsRedo();
			}
		}
	// }




	// const refetchTodos = async (refetch) => {
	// 	const { loading, error, data } = await refetch();
	// 	if (data) {
	// 		todolists = data.getAllTodos;
	// 		if (activeList._id) {
	// 			let tempID = activeList._id;
	// 			let list = todolists.find(list => list._id === tempID);
	// 			setActiveList(list);
	// 		}
	// 	}
	// }

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
		 todolists = data.getAllTodos;
		 if (activeList._id) {
		  let tempID = activeList._id;
		  let list = todolists.find(list => list._id === tempID);
		  setActiveList(list);
		 }
		 return true
		}
		else return false;
	   }

	
	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		toggleHasRedo(props.tps.hasTransactionToRedo());
		toggleHasUndo(props.tps.hasTransactionToUndo());
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		toggleHasRedo(props.tps.hasTransactionToRedo());
		toggleHasUndo(props.tps.hasTransactionToUndo());
		return retVal;
	}

	const checkActiveList = () => {
		if (activeList._id){
			return true;
		}
		else {
			return false;
		}
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const maxId = Math.max.apply(Math, items.map(function(item) { return item.id; }))
		const newID = items.length >= 1 ? maxId + 1 : 0;
		const newItem = {
			_id: '',
			id: newID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: "Not Assigned",
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => { 
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		// await refetchTodos(refetch);
		tpsRedo();
	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const sortByColumn = async (sortingCriteria) => {
		let listID = activeList._id;
		let oldItemsIds = [];
    	let itemsToSort = [];
		for (let i = 0; i < activeList.items.length; i++) {
			let item = activeList.items[i];
			oldItemsIds.push(item.id);
			itemsToSort.push(item);
		  }
		let sortIncreasing = isInIncreasingOrder(itemsToSort, sortingCriteria);
		let compareFunction = makeCompareFunction(sortingCriteria, sortIncreasing);
		itemsToSort = itemsToSort.sort(compareFunction);
		let newItemsIds = [];
		for (let i = 0; i < itemsToSort.length; i++) {
			let item = itemsToSort[i];
			newItemsIds.push(item.id);
		  }
		console.log(typeof(newItemsIds[0]));
		let transaction = new SortItems_Transaction (listID, oldItemsIds, newItemsIds, SortByColumn);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

const isInIncreasingOrder = (itemsToTest, sortingCriteria) => {
	for (let i = 0; i < itemsToTest.length - 1; i++) {
		let a = itemsToTest[i][sortingCriteria];
		let b = itemsToTest[i + 1][sortingCriteria];
		let c = a>b
	  if (itemsToTest[i][sortingCriteria] > itemsToTest[i + 1][sortingCriteria]){
		return false;
	  }
	}
	return true;
}

const makeCompareFunction = (criteria, increasing) => {
	return function (item1, item2) {
	  let negate = 1;
	  if (increasing) {
		negate = -1;
	  }
	  let value1 = item1[criteria];
	  let value2 = item2[criteria];
	  if (value1 < value2) {
		return -1 * negate;
	  }
	  else if (value1 === value2) {
		return 0;
	  }
	  else {
		return 1 * negate;
	  }
	}
  }


	const createNewList = async () => {
		const length = todolists.length
		const maxId = Math.max.apply(Math, todolists.map(function(todolist) { return todolist.id; }))
		const newId = length >= 1 ? maxId + 1 : 0;
		let list = {
			_id: '',
			id: newId,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
			top: false
		}
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		// refetch();
		// await refetchTodos(refetch);
  		// if(data) {
   		// let _id = data.addTodolist;
   		// let newList = todolists.find(list => list._id === _id);
   		// handleSetActive(newList.id)
		// //    setActiveList(newList); 
  		// } 
		const refetched = await refetchTodos(refetch);
		if(refetched && data) {
		let _id = data.addTodolist;
		let newList = todolists.find(list => list._id === _id);
		handleSetActive(newList.id)
		}

		props.tps.clearAllTransactions();
		toggleHasRedo(props.tps.hasTransactionToRedo());
		toggleHasUndo(props.tps.hasTransactionToUndo());

	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
		props.tps.clearAllTransactions();
		toggleHasRedo(props.tps.hasTransactionToRedo());
		toggleHasUndo(props.tps.hasTransactionToUndo());

	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const updateListsIndex = async (id) =>{
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		await ChangeTodolistsTop({ variables: {new_id: todo._id },refetchQueries: [{ query: GET_DB_TODOS }] });
		// refetch();	
	}

	const handleSetActive = async (id) => {
		updateListsIndex(id)
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		setActiveList(todo);
		props.tps.clearAllTransactions();
		toggleHasRedo(props.tps.hasTransactionToRedo());
		toggleHasUndo(props.tps.hasTransactionToUndo());
	};

	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField}	checkActiveList = {checkActiveList}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									activeList={activeList} setActiveList={setActiveList}
									undo={tpsUndo} redo={tpsRedo}
									hasRedo = {hasRedo} hasUndo = {hasUndo} 
									tps = {props.tps}
									sortByColumn = {sortByColumn}
									toggleHasRedo = {toggleHasRedo}
									toggleHasUndo = {toggleHasUndo}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;