export const Todos = () => {

    const [todos, setTodos] = useState({});

    const getTodos = async (id) => {

        await fetch('/api/gettodos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id}),
            })
            .then(res => {
            if(res.status() == 200) {
                setTodos(JSON.parse(res.body.todos));
            }
            else {
                //なんか失敗したらしい
                setTodos({});
                console.log("取得失敗");
            }
        });

    }

    const addTodo = async (id, todo) => {

        await fetch('api/addtodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, todo: todo}),
        })
        .then(res => {
            if(res.status() == 200) {
                setTodos(...todos, JSON.parse(res.body.todo).todo);
            }
            else {
                //失敗
                console.log("追加失敗");
            }
        });

    }

    const removeTodo = async (id, todoid) => {
        await fetch('/api/removetodo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, todoid: todoid}),
        })
        .then(res => {
            if(res.status() == 200) {
                const newTodos = todos;
                newTodos.filter((todo) => todo.id !== todoid);
                setTodos(newTodos);
            }
            else {
                //失敗 何も起きない
                console.log("削除失敗");
            }
        });
    }


}