import Head1 from "./Head1";
import Head from "./Head";
import React, {
    useState
} from 'react';


const Header = () => {
    const [inputLocationFocused, setInputLocationFocused] = useState(false);
    return (
        <>
            <Head
                inputLocationFocused={inputLocationFocused}
                setInputLocationFocused={setInputLocationFocused}
            />
            {window.innerWidth > 500 ? <Head1 /> :
                !inputLocationFocused && <Head1 />
            }
        </>
    );
}

export default Header;
