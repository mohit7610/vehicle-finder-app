import { Card, TextField, Button, Select } from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import "../assets/style.css";
import { ProductsCard } from './ProductsCard';
  
export function FormCard() {

  const [brandvalue, setBrandValue] = useState({
    brand:"",
  });

  const [modelvalue, setModelValue] = useState({
    selectbrandmodel:"",
    model:"",
  });

  const [generationvalue, setGenerationValue] = useState({
    selectbrandgeneration:"",
    selectmodelgeneration:"",
    generation:"",
  });

 

  const handleBrandChange = (e) => {
    setBrandValue(prev=>({...prev, [e.target.name]: e.target.value }))
  }


  const handleBrandClick = async e => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8081/api/addbrand", brandvalue);
      alert('Brand Add Sucessfully');
      fetchAllBrands()
      fetchAllModel()
    } catch (error) {
      console.log(error);
    }
  }

  const handleModelChange = (e) => {
    setModelValue(prev=>({...prev, [e.target.name]: e.target.value }))
  }


  const handleModelClick = async e => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8081/api/addmodel", modelvalue);
      alert('Model Add Sucessfully');
      fetchAllBrands()
      fetchAllModel()
    } catch (error) {
      console.log(error);
    }
  }


  const handleGenerationChange = (e) => {
    setGenerationValue(prev=>({...prev, [e.target.name]: e.target.value }))
  }


  const handleGenerationClick = async e => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8081/api/addgeneration", generationvalue);
      alert('Generation Add Sucessfully');
    } catch (error) {
      console.log(error);
    }
  }

  // Get brand values
  const [brandoptions, setBrandOptions] = useState([]);
  useEffect(()=>{
    fetchAllBrands()
  },[]);

  async function fetchAllBrands() {
    try {
      const res = await axios.get("http://localhost:8081/api/getbrand")
      setBrandOptions(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Get Model values
  const [modeloptions, setModelOptions] = useState([]);
  useEffect(()=>{
    fetchAllModel()
  },[])

  async function fetchAllModel() {
    try {
      const res = await axios.get("http://localhost:8081/api/getmodel")
      setModelOptions(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <>
      <Card
        sectioned>
        <label for="idbrand">Add Brand Name</label><br />
        <input type="text" id="idbrand" name='brand' onChange={handleBrandChange} />
        <div>
          <Button class="btn" onClick={handleBrandClick}>Add Brand</Button>
        </div>
      </Card> 
    
      <Card
        sectioned>
        <h2>Add Model</h2><hr/>
        <div style={{marginTop: '10px'}}>
          <label for="idselectbrandmodel">Select Brand Name</label><br />
          <select name="selectbrandmodel" id="idselectbrandmodel" onChange={handleModelChange}>
            <option value="">Select Brand</option>
            {brandoptions.map((brandoption, index) => {
              return <option key={index} >
                  {brandoption.brand}
              </option>
            })}
          </select>
        </div>
        <div style={{marginTop: '10px'}}>
          <label for="idmodel">Add Model Name</label><br />
          <input type="text" id="idmodel" name='model' onChange={handleModelChange} />
        </div>
        <div>
          <Button class="btn" onClick={handleModelClick}>Add Model</Button>
        </div>
       
      </Card>
      
      <Card
        sectioned>
        <h2>Add Generation</h2><hr />
        
        <div style={{marginTop: '10px'}}>
          <label for="selectbrandgeneration">Select Brand Name</label><br />
          <select name="selectbrandgeneration" id="selectbrandgeneration" onChange={handleGenerationChange}>
            <option value="">Select Brand</option>
            {brandoptions.map((brandoption, index) => {
              return <option key={index} >
                  {brandoption.brand}
              </option>
            })}
          </select>
        </div>
        <div style={{marginTop: '10px'}}>
          <label for="selectmodelgeneration">Select Model Name</label><br />
          <select name="selectmodelgeneration" id="selectmodelgeneration" onChange={handleGenerationChange}>
            <option value="">Select Model</option>
            {modeloptions.map((modeloption, index) => {
              return <option key={index} >
                  {modeloption.model}
              </option>
            })}
          </select>
        </div>
        <div style={{marginTop: '10px'}}>
          <label for="idgeneration">Add Generation Name</label><br/>
          <input type="text" id="idgeneration" name='generation' onChange={handleGenerationChange} />
        </div>
        
        <div>
          <Button class="btn" onClick={handleGenerationClick}>Add Generation</Button>
        </div>
        
      </Card>
      <Card>
        <ProductsCard/>
      </Card>
    </>  


  );    
}
