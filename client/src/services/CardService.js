import Api from "@/services/Api";

export default {
  getrecords(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await Api().get(url);
        const data = res.data;
        resolve(
          data
            .map(post => ({
              ...post
              // createdAt: new Date(post.createdAt)
            }))
            .reverse()
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  // Get one post
  getOnePost(url, id) {
    return Api().get(`${url}${id}`);
  },
  // Get last post
  getOneLastPost(url) {
    console.log("get one last " + url);
    return Api().get(url);
  },
  // Add Record
  insertRecord(text, url) {
    return Api()
      .post(url, text)
      .then(function(response) {
        console.log(response);
        return response;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  // Delete Record
  deleteRecord(url, id) {
    return Api()
      .delete(`${url}${id}`)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  // Update Post
  updateRecord(id, text, url) {
    // console.log(text)
    return Api()
      .put(`${url}${id}`, text)
      .then(function(response) {
        // console.log(response);
        return response;
      })
      .catch(function(error) {
        return error;
        // console.log(error);
      });
  },

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      //reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
      //reader.readAsBinaryString(file);
      //reader.readAsArrayBuffer(file);
    });
  },

  //Send Image File
  async sendImageFile(formData) {
    console.log(formData);
    return await Api()
      .post("/posts/upload", formData)
      .then(function(res) {
        //  console.log("SUCCESS!!");
        // console.log(res);
        return res;
        // console.log("flag in promise "+flag)
      })
      .catch(function(err) {
        console.log(err);
        console.log("FAILURE UPLOAD FILE!!");
        return err;
      });
  },

  //Rename existing File
  renameImageFile(oldName, newName) {
    return Api()
      .post("/posts/rename", { old: oldName, new: newName })
      .then(function(res) {
        return res;
      })
      .catch(function(err) {
        return err;
      });
  },

  deleteImageFile(file) {
    return Api()
      .post("/posts/delete", { data: file })
      .then(function(res) {
        return res;
      })
      .catch(function(err) {
        return err;
      });
  },

  /* async onFileChange2(e, div) {   
    let img = new Image;
    var files = e.target.files || e.dataTransfer.files;

    if (files.length > 0) {
    

        img.src = URL.createObjectURL(files[0]);

        img.width = '100%';
        await div.append(img);

        


let cat = await this.readFileAsync(files[0])


      return cat
    }
  },*/

  async changeAlert(alert) {
    alert = !alert;
    console.log("change alert inside " + alert);
    return alert;
  },

  errorAlert(e) {
    let error = null;
    var files = e.target.files || e.dataTransfer.files;
    if (files[0].type.match(/^\w+/g)[0] !== "image") {
      error = "Тип файла не изображение!";
    }
    return error;
  },

  async showImage(div, imgFile) {
    let BOX = document.getElementById(div);
    let img = new Image();
    BOX.innerHTML = "";

    img.src =
      typeof imgFile === "object" ? URL.createObjectURL(imgFile) : imgFile;

    img.onload = function() {
      URL.revokeObjectURL(img.src);
    };

    img.style.height = "350px";
    img.style.width = "526px";
    await BOX.append(img);
  },

  async onFileChange(e, div, error) {
    var files = e.target.files || e.dataTransfer.files;

    if (files.length > 0 && error == null) {
      await this.showImage(div, files[0]);
      let formData = new FormData();
      formData.append("file", files[0], files[0].name);

      return {
        name: files[0].name,
        ext: files[0].name.match(/(\w+)$/g).join(),
        form: formData
      };
    } else {
      return null;
    }
  },

  async openFileDialog(e) {
    let id = "";

    if (e.target.getAttribute("class") === "v-btn__content") {
      id = e.target.parentElement.id;
    } else {
      id = e.target.id;
    }

    if (id !== "") {
      id = id === "open-file-add" ? "file-upload-add" : "file-upload-update";
    }
    document.getElementById(id).click();
  },

  //Delay for loader
  async delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
  },
  async changeDbConnection(url, login, pass) {
    return Api()
      .post(url, login, pass)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        const { response } = error;
        console.log("card serv response", response.data);
        return response.data;
      });
  },

  async checkConnection(url, user) {
    return Api()
      .post(url, user)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });
  },
  async fileInDir(url, file) {
    return Api()
      .post(url, file)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });
  }
};
