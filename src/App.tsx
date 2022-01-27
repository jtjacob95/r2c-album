import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Container, Grid, ImageList, ImageListItem, Card, CardMedia, CardActions, Button, Select, MenuItem, InputLabel, FormControl, ToggleButtonGroup, ToggleButton, Box} from '@mui/material';
import { width } from '@mui/system';

interface IPhoto{
  albumId: number,
  id: number,
  title: string,
  url: string,
  thumbnailUrl:string
}


function App() {
  
  const [albums, setAlbums] =  useState<IPhoto[]>([]);
  const [albumList, setAlbumList] = useState<number[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<number>(-1);
  const [currentPhotos, setCurrentPhotos] = useState<IPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<IPhoto>()

  useEffect(()=>{
    axios.get<IPhoto[]>('https://jsonplaceholder.typicode.com/photos')
    .then((res) => {
      const albumData:IPhoto[] = res.data
      const albumListData:number[] =[]
      
      setAlbums(albumData);

      albumData.forEach((photo)=>{
        if(albumListData.indexOf(photo.albumId)===-1){
          albumListData.push(photo.albumId)
        }
      })
      setAlbumList(albumListData)
      
      setCurrentAlbum(albumData[0].albumId);
    })
  },[])

  useEffect(()=>{
    setCurrentPhotos(albums.filter(({albumId})=>albumId===currentAlbum))
  }, [currentAlbum, albums])

  const handleAlbumClick = (event: any) => {
    setCurrentAlbum(Number(event.target.value));
    setSelectedPhoto(undefined);
  }

  const handlePhotoClick = (photo:IPhoto ) => {
    if(photo===selectedPhoto){
      setSelectedPhoto(undefined);
    }
    else{
      setSelectedPhoto(photo);
    }
  }

  const removePhoto = (photo:IPhoto) => {
    const albumCopy = albums.filter((albPhoto) => albPhoto.id!==photo.id);
    setAlbums(albumCopy);
    console.log(albums);
  }

  const updatePhoto = (photo:IPhoto, event:any) => {
    const newId = event.target.value;
    const albumCopy = [...albums]
    albumCopy[albums.indexOf(photo)].albumId=newId
    setAlbums(albumCopy);
    console.log(albums);
  }

  return (    
    <Container >
      <Grid container spacing={1}>
        <Grid item xs={1} >
          <ToggleButtonGroup
            orientation="vertical"
            value={currentAlbum}
            exclusive
            onChange={(e)=>handleAlbumClick(e)}
            >
              {albumList.map((albumEntry)=>(
                <ToggleButton value={albumEntry}>
                  {albumEntry}
                </ToggleButton>
              ))}
          </ToggleButtonGroup>

 
        </Grid>
        <Grid item xs={ 10 }>
          <ImageList
            variant="quilted"
            cols={6}
          >
            {
              currentPhotos.map((photo)=>{
                const selected = photo.id === selectedPhoto?.id;          
                return(
                  <ImageListItem cols={selected ? 4 : 1} rows={selected ? 4 : 1} onClick={(e)=> handlePhotoClick(photo)} >
                    <Card >
                        <CardMedia
                          component="img"
                          image={selected ? photo.url : photo.thumbnailUrl}
                        />                    
                        {selected && <CardActions>
                          <Box sx={{ display: 'flex',
                                     justifyContent: 'space-between',
                                     alignItems: 'center',
                                     width: '100%'
                                  }}>
                            <FormControl>
                            <InputLabel id="album-label">Album</InputLabel>
                            <Select
                              labelId="album-label"
                              value={photo.albumId}
                              label="Album"
                              onChange={(e)=>{updatePhoto(photo, e)}}
                            >
                            {albumList.map((albumEntry) => (
                              <MenuItem key={albumEntry} value={albumEntry}>{albumEntry}</MenuItem>
                            ))}
                            </Select>
                            </FormControl>                          
                            <div>{photo.title}</div>
                            <Button size="large" onClick={(e)=>{removePhoto(photo)}}>delete</Button>
                          </Box>
                        </CardActions>}
                    </Card>
                  </ImageListItem>
                )
              })
            }
          </ImageList>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
