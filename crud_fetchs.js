const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector("crud-title"),
$template = d.getElementById("crud-template").content,
$fragmento = d.createDocumentFragment();

const getAll = async () => {
    try {
       
        let res = await fetch("http://localhost:3000/santos"),
        json = await res.json();
        
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        
        json.forEach(element => {
            $template.querySelector(".nombre").textContent = element.nombre;
            $template.querySelector(".constelacion").textContent = element.constelacion;
            $template.querySelector(".edit").dataset.id = element.id;
            $template.querySelector(".edit").dataset.name = element.nombre;
            $template.querySelector(".edit").dataset.constelacion = element.constelacion;

            $template.querySelector(".delete").dataset.id = element.id;

            let $clone = d.importNode($template, true);
            $fragmento.appendChild($clone);
        });
        $table.querySelector("tbody").appendChild($fragmento);


    } catch (err) {
        let message = err.statusText || "ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}:${message} </b></p>`);
    }
}

getAll();

d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            //create post
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                };
                res = await fetch("http://localhost:3000/santos", options);
                json = await res.json();
                console.log("resp", json)
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                location.reload();

            } catch (error) {
                let message = error.statusText || "ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}:${message} </b></p>`);
            }
        } else {
            //update put
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                res = await fetch(`http://localhost:3000/santos/${e.target.id.value}`, options);
                json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (error) {
                let message = error.statusText || "ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}:${message} </b></p>`);
            }
        }
    }
})


d.addEventListener("click", async e=>{
    if(e.target.matches(".edit")){
        //$title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constelaccion;
        $form.id.value = e.target.dataset.id;
    }
    if(e.target.matches(".delete")){
        const isDelete =  confirm(`¿desea eliminar el id ${e.target.dataset.id} ?`);

        if(isDelete){
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                },
                res = await fetch(`http://localhost:3000/santos/${e.target.dataset.id}`, options),
                json = await res.json();
                console.log("preuba"+json)
                if (!res.ok) throw { status: res.status, statusText: res.statusText };

               // location.reload();
            } catch (error) {
                let message = error.statusText || "ocurrio un error";
                alert(`Error ${error.status}: ${message}`);
            }
        }
    }
});