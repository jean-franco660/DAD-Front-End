import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowStore = () => {
    const url='http://localhost:8080/inventario';
    const [store,setStore]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [description,setDescription]= useState('');
    const [size,setSize]= useState('');
    const [price,setPrice]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');

    useEffect( ()=>{
        getStore();
    },[]);

    const getStore = async () => {
        const respuesta = await axios.get(url);
        setStore(respuesta.data);
    }
    const openModal = (op,id, name,description,size, price) =>{
        setId('');
        setName('');
        setDescription('');
        setSize('');
        setPrice('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Produto');
        }
        else if(op === 2){
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescription(description);
            setSize(size);
            setPrice(price);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if(name.trim() === ''){
            show_alerta('Escribe el nombre del producto','warning');
        }
        else if(description.trim() === ''){
            show_alerta('Escribe la descripcion del producto','warning');
        }
        else if(price === ''){
            show_alerta('Escribe la talla del producto','warning');
        }
        else if(description.trim() === ''){
            show_alerta('Escribe el precio del producto','warning');
        }
        else{
            if(operation === 1){
                parametros= {name:name.trim(),description:description.trim(),size:size.trim(), price:price};
                metodo= 'POST';
            }
            else{
                parametros={name:name.trim(),description:description.trim(),size:size.trim(), price:price};
                metodo= 'PUT';
            }
            envarSolicitud(metodo,parametros);
        }
    }
    const envarSolicitud = async(metodo,parametros) => {
        await axios({ method:metodo, url: url, data:parametros}).then(function(respuesta){
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj,tipo);
            if(tipo === 'success'){
                document.getElementById('btnCerrar').click();
                getStore();
            }
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteStore= (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar el producto '+name+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                envarSolicitud('DELETE',{id:id});
            }
            else{
                show_alerta('El producto NO fue eliminado','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalStore'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>NOMBRE</th><th>DESCRIPCION</th><th>TALLA</th><th>PRECIO</th><th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {store.map( (store,i)=>(
                                    <tr key={store.id}>
                                        <td>{(i+1)}</td>
                                        <td>{store.name}</td>
                                        <td>{store.description}</td>
                                        <td>{store.size}</td>
                                        <td>S/.{new Intl.NumberFormat('es-pen').format(store.price)}</td>
                                        <td>
                                            <button onClick={() => openModal(2,store.id,store.name,store.description,store.size, store.price)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalStore'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteStore(store.id,store.name)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalstore' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                            onChange={(e)=> setName(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='Empresa' className='form-control' placeholder='Empresa' value={company}
                            onChange={(e)=> setDescription(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='Direccion' className='form-control' placeholder='Direccion' value={address}
                            onChange={(e)=> setPrice(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='Telefono' className='form-control' placeholder='telefono' value={phone}
                            onChange={(e)=> setPrice(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowStore