on save button click
pass up an onSave to listening component with the 
new final table state + the original props (newState, oldProps, numAnimals)


onSaveHandler will make a local copy of newState
onSaveHandler will normalize
	true => 1 / 0
	string numbers => numbers (handle NaN properly)
	

onSaveHandler will check if the number of animals has changed,
if so mark each row needing updated on server

onSaveHandler will go through new changes find entries with
an id (these are new entries)
	mark each row needing created on server


onSaveHandler will find updated fields and make a list.
	mark these as changed

