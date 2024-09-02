import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Divider, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


interface LabNote {
    title: string;
    description: string;
    timestamp: string;
  }
  
  interface Experiment {
    id: number;
    name: string;
    notes: LabNote[];
    isEditing?: boolean;
  }
  
  const LabNotebook: React.FC = () => {
    const [experiments, setExperiments] = useState<Experiment[]>([
        { id: 0, name: "Default Experiment", notes: [] }]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [newNote, setNewNote] = useState<LabNote>({ title: '', description: '', timestamp: '' });
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [newExperimentName, setNewExperimentName] = useState<string>('');
    const [editableName, setEditableName] = useState<string>('');
    const [editingId, setEditingId] = useState<number | null>(null);


  
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setSelectedTab(newValue);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNote({ ...newNote, [e.target.name]: e.target.value });
    };
  
    const handleSubmitNote = () => {
      if (newNote.title && newNote.description) {
        const updatedExperiments = experiments.map((experiment) => {
          if (experiment.id === selectedTab) {
            return {
              ...experiment,
              notes: [...experiment.notes, { ...newNote, timestamp: new Date().toLocaleString() }]
            };
          }
          return experiment;
        });
        setExperiments(updatedExperiments);
        setNewNote({ title: '', description: '', timestamp: '' }); // Reset form
      }
    };
  
    const handleOpenDialog = () => {
      setDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      setDialogOpen(false);
    };
  
    const handleAddExperiment = () => {
      if (newExperimentName) {
        const newExperiment = {
          id: experiments.length,
          name: newExperimentName,
          notes: []
        };
        setExperiments([...experiments, newExperiment]);
        setNewExperimentName('');
        setDialogOpen(false);
      }
    };
  

  // Function to start editing an experiment's name
  const startEdit = (experiment: Experiment) => {
    setEditingId(experiment.id);
    setEditableName(experiment.name);
  };

  // Function to handle name update (validate)
  const handleNameUpdate = (id: number) => {
    setExperiments(experiments.map(experiment => 
      experiment.id === id ? {...experiment, name: editableName} : experiment
    ));
    setEditingId(null);
  };

  // Function to cancel editing (cancel changes)
  const cancelEdit = () => {
    setEditingId(null);
    setEditableName('');
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditableName(event.target.value);
  };

    
  
    // Render the LabNotebook component
    return (
      <Box sx={{ padding: 3, marginTop: '5rem' }}>
        {/* ... existing code for Tabs and New Note Entry ... */}
        
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Lab Notebook</Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex'}}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {experiments.map((experiment) => (
          editingId === experiment.id ? (
            <Box key={experiment.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                value={editableName}
                onChange={handleNameChange}
                autoFocus
              />
              <IconButton onClick={() => handleNameUpdate(experiment.id)}><CheckIcon /></IconButton>
              <IconButton onClick={cancelEdit}><CloseIcon /></IconButton>
            </Box>
          ) : (
            <Tab
              key={experiment.id}
              label={experiment.name}
              onDoubleClick={() => startEdit(experiment)}
            />
          )
        ))}
        </Tabs>
        <Button
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ minWidth: 'auto', marginLeft: 2 }}
        >
          Add Experiment
        </Button>
      </Box>

     {/* Check if there are experiments before rendering the new note section */}
      {experiments.length > 0 && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">New Note for {experiments[selectedTab].name}</Typography>
            <TextField
            label="Title"
            name="title"
            value={newNote.title}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            />
            <TextField
            label="Description"
            name="description"
            value={newNote.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={handleSubmitNote}>Add Note</Button>
        </Paper>
      )}
      <List>
        {experiments[selectedTab].notes.map((note, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={note.title}
                secondary={`${note.timestamp} - ${note.description}`}
              />
            </ListItem>
            {index < experiments[selectedTab].notes.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

        {/* code for the list of experiments */}
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add New Experiment
        </Button>
  
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add New Experiment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the name of the new experiment.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Experiment Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newExperimentName}
              onChange={(e) => setNewExperimentName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddExperiment} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default LabNotebook;
  