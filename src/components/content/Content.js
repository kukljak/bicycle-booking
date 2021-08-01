import localforage from "localforage";
import React, { useEffect, useState } from "react";
import CloseIcon from "./CloseIcon";
import "./Content.css"
import DropDownIcon from "./DropDownIcon";

const Content = () => {

    const [name,setName] = useState();
    const [type,setType] = useState();
    const [color,setColor] = useState();
    const [wheelSize,setWheelsize] = useState();
    const [price,setPrice] = useState();
    const [id,setId] = useState();
    const [description, setDescription] = useState();
    const [bicycleList, setBicycleList] = useState();
    const [checkStatus, setCheckStatus] = useState();
    const statusBike = "Available";

    function countAvaibleBike() {
        let count = 0;
        bicycleList.map( (element) => {
            if (element.statusBike === "Available") {
                count++;
            }
        })
        return count;
    }

    function countBusyBike() {
        let count = 0;
        bicycleList.map( (element) => {
            if (element.statusBike === "Busy") {
                count++;
            }
        })
        return count;
    }
    

    function bikeAverage() {
        let bikeAverage = 0;
        bicycleList.map( (element) => {
            bikeAverage += parseFloat(element.price);  
        })
        bikeAverage = bikeAverage/bicycleList.length;
        
        return bikeAverage.toFixed(2);
    }

    async function getListFromDB() {
        setBicycleList(await localforage.getItem("bicycle-list"));
    }

    function checkDisable() {
        if (name && type && color && wheelSize && price && id && description && 
            name.length >= 5 && type.length >= 5 && color.length >= 5 && description.length >= 5 ) 
            {
                return false;

        } else {
            return true;
        }
    }

    function clearState () {
        setName();
        setType();
        setColor();
        setWheelsize();
        setId();
        setPrice();
        setDescription();
    }

    function removeBicycle(event) {
        const newBicycleList = bicycleList.filter( (element) => element.id !== event.target.parentElement.id );
        setBicycleList(newBicycleList);
        localforage.setItem("bicycle-list", newBicycleList);
    }

    function borderStatusBike () {

        for (let i = 0; i < bicycleList.length; i++) {
            if(bicycleList[i].statusBike === "Available") {
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("unavaible");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("busy");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.add("available");
            } else if(bicycleList[i].statusBike === "Unavaible") {
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("busy");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("available");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.add("unavaible");
            } else if (bicycleList[i].statusBike === "Busy") {
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("unavaible");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.remove("available");
                document.querySelector(`#root > main > div.bicycle-list > div:nth-child(${i + 1})`).classList.add("busy");
            }
        }
        
    }

    function changeStatusBike(event) {
        let elementId = event.target.parentElement.id;
        elementId = elementId.replace("submenu ", "");
        let newBicycleList = bicycleList;

        const indexBicycle = bicycleList.findIndex( (element) => element.id === elementId);
        newBicycleList[indexBicycle].statusBike = event.target.innerText;

        setBicycleList(newBicycleList);
        
        localforage.setItem("bicycle-list", bicycleList);
        setCheckStatus(event.target.parentElement.id);
        borderStatusBike();
        
    }

    async function submitBicycleInfo (event) {
        event.preventDefault();
        const bicycleData = await localforage.getItem("bicycle-list");
        if (bicycleData === null) {
            setBicycleList([{
                "name":name,
                "type":type,
                "color":color,
                "wheel":wheelSize,
                "price":price,
                "id":id,
                "description":description,
                "statusBike": statusBike,
            }]);
            
            document.getElementById("myForm").reset();
            clearState();

        } else if (!bicycleData.find(el => el.id === id)){

            setBicycleList([...bicycleData, {
                    "name":name,
                    "type":type,
                    "color":color,
                    "wheel":wheelSize,
                    "price":price,
                    "id":id,
                    "description":description,
                    "statusBike": statusBike,
                }]);

            document.getElementById("myForm").reset();
            clearState();
            
        } else {
            alert("This bicycle-id already exists, please change it to another");
        }
        
    }


    window.onload = async function () {
        getListFromDB();
    }

    useEffect(() => {
        if (!!bicycleList) {
            localforage.setItem("bicycle-list", bicycleList);
            borderStatusBike();
        }
        
        
    },[bicycleList])

    useEffect(() => {
        getListFromDB();
        if (!!bicycleList) {
            borderStatusBike();
        }
    },[checkStatus])
       
    return(
        <main>
            <div className="bicycle-list">
                {bicycleList && bicycleList.map( (element) => {
                    return(
                        <div className="bicycle-box-info" key={element.id}>
                            <div className="bicycle-info" >
                                <div className="name-type">
                                    <h2 id="name">
                                        {element.name} &nbsp;
                                    </h2>
                                    <h2 id="type">
                                        - {element.type}
                                    </h2>
                                    <h2 id="color">
                                        ({element.color})
                                    </h2>
                                </div>
                                <div className="id">
                                    <h3>
                                        id:{element.id}
                                    </h3>
                                </div>
                                <div className="status-bike">
                                    <div className="status">
                                        Status
                                    </div>
                                    <div>
                                        <ul className="menu">
                                            <li>
                                                <span className="dropdown-btn" onClick={ () => setCheckStatus(element.id)}>{element.statusBike}</span>
                                                <DropDownIcon /> 
                                                <ul id={`submenu ${element.id}`} className={element.id !== checkStatus ? "hideDropList" : null}>                                                                                     
                                                    <li onClick={(event) => {changeStatusBike(event)}}>
                                                        Unavaible
                                                    </li>
                                                    <li onClick={(event) => {changeStatusBike(event)}}>
                                                        Busy
                                                    </li>
                                                    <li onClick={(event) => {changeStatusBike(event)}}>
                                                        Available
                                                    </li>                                                                                     
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            <div className="delete-price-box">
                                <div id={element.id} className="dropdown-close" onClick={(event) => {removeBicycle(event)}}>
                                    <CloseIcon />
                                </div>
                                <div>
                                    <h3 className="price">
                                        {parseFloat(element.price).toFixed(2)} UAH/hr.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="section-line"></div>

            <div className="add-bicycle">
                <form id="myForm" className="inputInfo">
                    <input type="text" placeholder="Name" required onChange={ (event) => setName(event.target.value)} />
                    <input type="text" placeholder="Type" required onChange={ (event) => setType(event.target.value)} />
                    <input type="text" placeholder="Color" required onChange={ (event) => setColor(event.target.value)} />
                    <input type="number" id="numbers" placeholder="Wheel size" required onChange={ (event) => setWheelsize(event.target.value)} />
                    <input type="number" id="numbers" placeholder="Price" required onChange={ (event) => setPrice(event.target.value)} />
                    <input type="number" id="numbers" placeholder="ID (slug) XXXXXXXXXXX" required onChange={ (event) => setId(event.target.value)} />
                    <textarea type="text" id="description" placeholder="Description" required onChange={ (event) => setDescription(event.target.value)} />
                    <button type="submit" disabled={checkDisable()} onClick={(event) => {submitBicycleInfo(event)}} className="form-btn submit-btn">SAVE</button>
                    <button type="reset" className="form-btn clear-btn" >CLEAR</button>
                </form>
                <hr />
                <div>
                    <div className="statistics-info">
                        <h3> 
                            Statistics
                        </h3>
                        <h4>
                            <span className="statistics-title">
                            Total Bikes:&nbsp;
                            </span>
                            <span>
                                {bicycleList && bicycleList.length}
                            </span>                             
                        </h4>
                        <h4>
                            <span className="statistics-title">
                                Available Bikes:&nbsp;
                            </span>
                            <span>
                                {bicycleList && countAvaibleBike()}
                            </span>
                        </h4>
                        <h4>
                            <span className="statistics-title">
                                Booked Bikes:&nbsp;
                            </span>
                            <span>
                                {bicycleList && countBusyBike()}
                            </span>
                        </h4>
                        <h4>
                            <span className="statistics-title">
                                Average bike cost:&nbsp;
                            </span>
                            <span>
                                {bicycleList && bikeAverage()}&nbsp;
                            </span>
                            <span className="statistics-title">
                                UAH/hr
                            </span>                              
                        </h4>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Content;