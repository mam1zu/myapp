import { Todos } from './components/Todos';

export const Home = (props) => {
    
    return(
        <div>
            <Todos id={props.id}></Todos>
        </div>
    );
}