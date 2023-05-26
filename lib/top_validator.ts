import axios, { AxiosInstance, AxiosProgressEvent } from "axios"

// import FormData from "form-data"

// const BACKENDLINK = "http://localhost:8080/"
const BACKENDLINK = "https://emailverifier-production.up.railway.app/"
export default class TopEmailValidator {
  client: AxiosInstance
  jwtToken: string

  constructor(apiKey: string) {
    this.jwtToken = apiKey
    this.client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": apiKey,
      },
    })
  }
  static async uploadFile(token: string, uploadData: any): Promise<any> {
    const client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": token,
        "Content-Type": "multipart/form-data",
      },
    })
    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total!) * 100
      )
      console.log(`Upload Progress: ${progress}%`)
    }
    const config = {
      onUploadProgress: onUploadProgress,
      headers: { "Content-Type": "multipart/form-data" },
    }
    const form = new FormData()
    for (let key in uploadData) {
      if (key === "file") continue
      form.append(key, uploadData[key])
    }
    // form.append("first_name_column_name", uploadData.first_name_column_name)
    // form.append("last_name_column_name", uploadData.last_name_column_name)
    // form.append("email_column_name", uploadData.email_column_name)
    // form.append("domain_column_name", uploadData.domain_column_name)
    // form.append("get_missing_emails", uploadData.get_missing_emails)
    // form.append(
    //   "brute_force_failed_emails",
    //   uploadData.brute_force_failed_emails
    // )
    form.append("file", uploadData.file, uploadData.file.name)

    const response = await client.post("/upload", form, config)
    return response.data.files
  }
  static async signUp(
    fname: string,
    lname: string,
    email: string,
    password: string
  ): Promise<any> {
    let res = await axios.postForm(BACKENDLINK + "api" + "/user/signup", {
      email,
      password,
      fname,
      lname,
    })
    return res["data"]["token"]
  }

  static async signIn(email: string, password: string): Promise<any> {
    let res = await axios.postForm(BACKENDLINK + "api" + "/user/signin", {
      email,
      password,
    })
    return res["data"]
  }

  static async getFiles(token: string): Promise<any> {
    const client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": token,
      },
    })
    const response = await client.get("/get_files")
    return response.data.files
  }
  static async startVerification(token: string, fileId: string): Promise<any> {
    const client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": token,
      },
    })
    const response = await client.get(`/list/${fileId}/start_verification`)
    // return response.data.files;
  }
  static async downloadFile(
    token: string,
    fileId: string,
    fileName: string,
    valid_only: boolean
  ) {
    const client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": token,
      },
    })

    let url = `/file/${fileId}/download`
    if (valid_only) {
      url = `/file/${fileId}/download_valid`
    }

    client.get(url).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
    })
  }
  static async getVerificationStatus(
    token: string,
    fileId: string
  ): Promise<any> {
    const client = axios.create({
      baseURL: BACKENDLINK + "api",
      // timeout: 1000,
      headers: {
        "X-API-KEY": token,
      },
    })
    const response = await client.get(`/list/${fileId}/progress`)
    return response.data.progress
  }
}
