import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({filter, changeEvent}) =>
{
	return (
	<div>
		filter shown with: <input value = {filter} onChange = {changeEvent}/>
	</div>
	)
}

const PersonForm = (props) =>
{
	return (
	<form onSubmit = {props.submitEvent}>
		<div>
			name: <input value = {props.name} onChange = {props.nameEvent}/>
		</div>
		<div>
			number: <input value = {props.number} onChange = {props.numberEvent}/>
		</div>
		<div>
			<button type="submit">add</button>
		</div>
	</form>
	)
}

const Persons = ({persons, clickDelete}) =>
{
	return (
		<>
		{
			persons.map(person => 
			<p key={person.id}>
				{person.name} {person.number}&nbsp;
				<button type="button" onClick={() => clickDelete(person.id)}>delete</button>
			</p>)
		}
		</>
	)
}

const Notification = ({ message, type }) => {
	if (message === null) {
	  return null
	}
  
	return (
	  <div className={type}>
		{message}
	  </div>
	)
  }

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	const [message, setMessage] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => { personService.getAll().then(data => setPersons(data))}, [])

	const addPerson = (event) => 
	{
		event.preventDefault()

		const pers = persons.find(p => p.name === newName)

		if ( pers )
		{
			updatePerson(pers.id);
			//alert(`${newName} is already added to phonebook`)
			return;
		}

		const newObj = 
		{
			name: newName,
			number: newNumber
		}

		personService.addSingle(newObj).then(data =>
		{
			setPersons(persons.concat(data))
			setMessage("Added " + newName)
			setTimeout(() => { setMessage(null) }, 2000)
		}).catch( error =>
		{
			console.log(error.response.data)
			setError(JSON.stringify(error.response.data))
			setTimeout(() => { setError(null) }, 3000)
		})
	}

	const deletePerson = (id) =>
	{
		const pers = persons.find(p => p.id === id)
	
		if ( !window.confirm("Delete " + pers.name) )
			return;

		personService.remove(id).then(() =>
		{
			setPersons(persons.filter(p => p.id !== id))
			setMessage("Deleted " + pers.name)
			setTimeout(() => { setMessage(null) }, 2000)
		}).catch( (error) =>
		{
			setError("Information of " + pers.name + " has already been removed from server")
			setTimeout(() => { setError(null) }, 3000)
		})
	}

	const updatePerson = (id) =>
	{
		const pers = persons.find(p => p.id === id)

		if ( !window.confirm(pers.name + " is already added to phonebook, replace the old number with a new one?") )
			return;

		const newObj = { ...pers, number: newNumber}

		personService.update(id, newObj).then(data =>
		{
			setPersons(persons.map(p => p.id !== id ? p : data))
			setMessage("Updated " + newObj.name)
			setTimeout(() => { setMessage(null) }, 2000)
		}).catch( (error) =>
		{
			if ( error.response.status === 400 )
			{
				setError(JSON.stringify(error.response.data))
			}
			else
			{
				setError("Information of " + pers.name + " has already been removed from server")
			}
			
			setTimeout(() => { setError(null) }, 3000)
		})
	}

	const displayedPersons = filter.length === 0
	? persons
	: persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


  return (
	<div>
		<h2>Phonebook</h2>
		<Notification message={error} type="error" />
		<Notification message={message} type="message"/>
		<Filter filter = {filter} changeEvent = { event => setFilter(event.target.value)} />
		<h3>Add a new</h3>
		<PersonForm 
			name={newName}
			number={newNumber}
			nameEvent={event => setNewName(event.target.value)}
			numberEvent={event => setNewNumber(event.target.value)}
			submitEvent={addPerson} 
		/>
		<h3>Numbers</h3>
		<Persons persons = {displayedPersons} clickDelete = {deletePerson}/>
	</div>
	)

}

export default App