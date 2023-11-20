import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowSupplier = () => {
    const url='http://localhost:8080/proveedor';
    const [supplier,setSupplier]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [company,setCompany]= useState('');
    const [address,setAddress]= useState('');
    const [phone,setPhone]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');

    useEffect( ()=>{
        getSupplier();
    },[]);

    const getSupplier = async () => {
        const respuesta = await axios.get(url);
        setSupplier(respuesta.data);
    }
    const openModal = (op,id, name,company,address, phone) =>{
        setId('');
        setName('');
        setCompany('');
        setAddress('');
        setPhone('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Proveedor');
        }
        else if(op === 2){
            setTitle('Editar Proveedor');
            setId(id);
            setName(name);
            setCompany(company);
            setAddress(address);
            setPhone(phone);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if(name.trim() === ''){
            show_alerta('Escribe el nombre del proveedor','warning');
        }
        else if(description.trim() === ''){
            show_alerta('Escribe la compañia del proveedor','warning');
        }
        else if(price === ''){
            show_alerta('Escribe la direccion del proveedor','warning');
        }
        else if(description.trim() === ''){
            show_alerta('Escribe el telefono del proveedor','warning');
        }
        else{
            if(operation === 1){
                parametros= {name:name.trim(),company:company.trim(),address:address.trim(), phone:phone};
                metodo= 'POST';
            }
            else{
                parametros={id:id,name:name.trim(),company:company.trim(),address:address.trim(), phone:phone};
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
                getSupplier();
            }
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteSupplier= (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar '+name+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                envarSolicitud('DELETE',{id:id});
            }
            else{
                show_alerta('NO fue eliminado','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalSupplier'>
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
                                <tr><th>#</th><th>NOMBRE</th><th>EMPRESA</th><th>DIRECCION</th><th>TELEFONO</th><th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {supplier.map( (supplier,i)=>(
                                    <tr key={supplier.id}>
                                        <td>{(i+1)}</td>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.company}</td>
                                        <td>{supplier.address}</td>
                                        <td>{supplier.phone}</td>
                                        <td>
                                            <button onClick={() => openModal(2,supplier.id,supplier.name,supplier.company,supplier.address, supplier.phone)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteSupplier(supplier.id,supplier.name)} className='btn btn-danger'>
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
        <div id='modalSupplier' className='modal fade' aria-hidden='true'>
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
                            onChange={(e)=> setCompany(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='Direccion' className='form-control' placeholder='Direccion' value={address}
                            onChange={(e)=> setAddress(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='Telefono' className='form-control' placeholder='telefono' value={phone}
                            onChange={(e)=> setPhone(e.target.value)}></input>
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

export default ShowSupplier