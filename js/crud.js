
const d = document,
    $table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector("crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragmento = d.createDocumentFragment();

const ajax = (options) => {
    console.log('prueba');
    let { url, method, success, error, data } = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            console.log(json);
            success(json);
        } else {
            let message = xhr.statusText || "ocurrio un error";
            error(`Error ${xhr.status}: ${message}`);
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
};

const getAll = () => {
    console.log("se ejecuto");
    ajax({
        method: "GET",
        url: "http://localhost:3000/santos",
        success: (res) => {
            console.log(res);
            res.forEach(element => {
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
        },
        error: (err) => {
            $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        data: null
    })
};

getAll();


d.addEventListener("submit", e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            //create post
            ajax({
                url: "http://localhost:3000/santos",
                method: "POST",
                success: (res) => console.log("exito"),
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            });
        } else {
            //update put
            console.log("put")
            ajax({
                url: `http://localhost:3000/santos/${e.target.id.value}`,
                method: "PUT",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            });
        }
    }
})
d.addEventListener("click", e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.nombre;
        $form.constelacion.value = e.target.dataset.constelacion;
        $form.id.value = e.target.dataset.id;
    }
})
d.addEventListener("click", e => {
    if (e.target.matches(".delete")) {
        const isDelete = confirm(`¿desea eliminar el id ${e.target.dataset.id} ?`)

        if (isDelete) {
            ajax({
                url: `http://localhost:3000/santos/${e.target.dataset.id}`,
                method: "DELETE",
                success: (res) => location.reload(),
                error: () => alert(err)
            });
        }
    }
})