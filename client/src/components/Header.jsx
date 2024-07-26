import info from '../assets/info.png'
import '../styles/Header.css'

const Header = () => {
    return (
        <main className="header-parent">
            <h1>DoseMaster</h1>
            <img className="icon-info" src={info} />


        </main>
    );
};

export default Header;