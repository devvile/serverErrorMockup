import { Link } from "react-router-dom";

const HomePage = ( ) =>{
    return <>
     <h1>Welcome to Server Error Generator</h1>
     <p className="mt-6">You can go to Error Generation page here:</p>
     <Link to={"/generator"}><button className="mt-4">GO TO ERROR GENERATOR</button></Link>
    </>
}

export default HomePage;