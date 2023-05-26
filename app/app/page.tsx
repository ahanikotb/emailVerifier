"use client"

import React, { use, useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { RootState } from "@/store/store"
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Delete,
  DownloadIcon,
  FileBarChart2,
  Loader2,
  Mail,
  PlayIcon,
  Plus,
  Rocket,
  Trash,
} from "lucide-react"
import Papa from "papaparse"
import { useDropzone } from "react-dropzone"
import { useSelector } from "react-redux"

import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import "react-dropzone-uploader/dist/styles.css"
import { set } from "date-fns"

import TopEmailValidator from "@/lib/top_validator"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LineChart from "@/components/LineChart"

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
}
const FileDisplayCard = ({ file, token }) => {
  const [progress, setProgress] = useState(
    Number(file.VerificationStatus.PercentageDone)
  )

  const [fileState, setFileState] = useState(file)
  // console.log(fileState.VerificationStatus)

  useEffect(() => {
    if (fileState.VerificationStatus.Status == "Verifying") {
      const interval = setInterval(() => {
        TopEmailValidator.getVerificationStatus(token, file.ID).then((res) => {
          // console.log(res)
          setProgress(Number(res.PercentageDone))
          if (res.Status == "Done") {
            clearInterval(interval)

            setFileState((prev) => ({
              ...prev,
              VerificationStatus: res,
            }))
          }
        })
      }, 10000)
    }
  }, [
    file.ID,
    file.VerificationStatus.Status,
    fileState.VerificationStatus,
    fileState.VerificationStatus.Status,
    token,
    progress,
  ])

  return (
    <div>
      <Card className="my-5 min-w-[450px] max-w-[450px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{file.FileName}</CardTitle>
          <CardDescription>
            Status: {fileState.VerificationStatus.Status}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {fileState.VerificationStatus.Status == "Verifying" ? (
            <Progress value={progress} />
          ) : fileState.VerificationStatus.Status == "Done" ? (
            <LineChart data={fileState.VerificationStatus} />
          ) : (
            <div></div>
          )}
        </CardContent>
        <CardFooter className="item-center flex justify-between">
          <div className="flex justify-between">Rows: {file.Rows}</div>
          <div className="flex">
            {fileState.VerificationStatus.Status == "Done" ? (
              <Button variant="ghost">
                <Rocket />
              </Button>
            ) : (
              ""
            )}

            <div>
              {fileState.VerificationStatus.Status == "Done" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-0">
                    <Button variant="ghost">
                      <DownloadIcon
                      // onClick={async () => {
                      //   TopEmailValidator.downloadFile(
                      //     token,
                      //     fileState.ID,
                      //     fileState.FileName.split(".")[0] + "_verified.csv"
                      //   )
                      // }}
                      ></DownloadIcon>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        TopEmailValidator.downloadFile(
                          token,
                          fileState.ID,
                          fileState.FileName.split(".")[0] + "_verified.csv",
                          true
                        )
                      }}
                    >
                      Valid Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        TopEmailValidator.downloadFile(
                          token,
                          fileState.ID,
                          fileState.FileName.split(".")[0] + "_verified.csv",
                          false
                        )
                      }}
                    >
                      All Results
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : fileState.VerificationStatus.Status == "Verifying" ? (
                <Button variant="ghost" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    TopEmailValidator.startVerification(
                      token,
                      fileState.ID
                    ).then((res) => {
                      setFileState((prev) => ({
                        ...prev,
                        VerificationStatus: {
                          ...fileState.VerificationStatus,
                          Status: "Verifying",
                        },
                      }))
                    })
                  }}
                >
                  <PlayIcon></PlayIcon>
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

const cleanArray = (arr) => {
  const uniqueArr = arr.filter((item, index) => {
    return (
      index ===
      arr.findIndex((obj) => {
        return obj.SystemFileName === item.SystemFileName
      })
    )
  })
  return uniqueArr.sort((a, b) => (a.ID > b.ID ? -1 : a.ID < b.ID ? 1 : 0))
}
export default function DashboardPage() {
  const router = useRouter()
  const { token, userData } = useSelector((state: RootState) => state.user)
  const [step, setStep] = useState(0)
  const [openSheet, setOpenSheet] = useState(false)
  const [headers, setHeaders] = useState([])
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    file: "",
    first_name_column_name: "",
    last_name_column_name: "",
    email_column_name: "Email",
    domain_column_name: "",
    get_missing_emails: false,
    brute_force_failed_emails: false,
    include_generic_emails: false,
  })
  const uploadCSV = async () => {
    const newFiles = await TopEmailValidator.uploadFile(token, form)

    setFiles(cleanArray(newFiles))
  }
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setForm((prev) => ({ ...prev, file }))
      const reader = new FileReader()

      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result

        // Convert the ArrayBuffer to a string
        const decoder = new TextDecoder("utf-8")
        //@ts-ignore
        const csvString = decoder.decode(binaryStr)

        // // Parse the CSV string using a library like PapaParse
        // const parsedData = Papa.parse(csvString)

        // console.log(parsedData)
        //@ts-ignore
        Papa.parse(csvString, {
          complete: function (results) {
            //@ts-ignore
            setHeaders(
              //@ts-ignore
              results.data[0].map((header) => {
                return { name: header, value: header }
              })
            )
            // //@ts-ignore
            // setCsvData(results.data)
            // //@ts-ignore
            // setSamples(results.data.slice(1, 5))
            setForm((prev) => ({
              ...prev,
              //@ts-ignore
              email_column_name: results.data[0][0],
              // first_name_column_name: results.data[0][0],
              // last_name_column_name: results.data[0][0],
              // domain_column_name: results.data[0][0],
            }))

            setStep(2)
          },
        })
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  useEffect(() => {
    TopEmailValidator.getFiles(token).then((res) => {
      setFiles(cleanArray(res))
      setLoading(false)
    })
  }, [])
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }
  return (
    <>
      <Sheet
        open={openSheet}
        onOpenChange={(e) => {
          setOpenSheet(e)
          setStep(0)
        }}
      >
        {/* <SheetTrigger asChild>
      <Button size="lg">Import</Button>
    </SheetTrigger> */}
        <SheetContent size="full">
          {/* <Alert
            className="bottom-10 fixed left-1/2 -translate-x-1/2
            w-3/4"
            variant="default"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert> */}
          <div
            className={cn(
              "h-full",
              step == 0 ? "grid place-content-center" : "mx-0",
              step == 1 ? "grid place-content-center" : "mx-0",
              step == 2 ? "grid place-content-center" : "mx-0"
            )}
          >
            <div className="mx-auto w-3/4 ">
              {step === 0 ? (
                <Card
                  onClick={() => setStep(1)}
                  className="grid w-[500px]   cursor-pointer grid-cols-4 place-content-center p-10"
                >
                  <FileBarChart2 className="h-[50px] w-[50px]"></FileBarChart2>
                  <Separator orientation="vertical"></Separator>
                  <h1 className="text-center text-2xl font-bold">UPLOAD CSV</h1>
                </Card>
              ) : null}
              {step === 1 ? (
                <>
                  {" "}
                  <div {...getRootProps({ ...baseStyle })}>
                    <input {...getInputProps()} />
                    <p>
                      Drag &apos;n&apos; drop some files here, or click to
                      select files
                    </p>
                  </div>
                </>
              ) : null}
              {step === 2 ? (
                <>
                  <Card className="grid w-[400px]   ">
                    <CardHeader>
                      <CardTitle> Settings</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="flex  items-center justify-between">
                        <h1>Email</h1>
                        <Select
                          onValueChange={(value) => {
                            setForm((prev) => ({
                              ...prev,
                              email_column_name: value,
                            }))
                          }}
                          value={form.email_column_name}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <ScrollArea className="h-[200px]">
                                {headers.map((header) => {
                                  return (
                                    //@ts-ignore
                                    <SelectItem value={header.value}>
                                      {
                                        //@ts-ignore
                                        header.name
                                      }
                                    </SelectItem>
                                  )
                                })}
                              </ScrollArea>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between my-5">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Fill Missing Emails ?
                        </label>
                        <Checkbox
                          checked={form.get_missing_emails}
                          onCheckedChange={(v) =>
                            //@ts-ignore
                            setForm((prev) => ({
                              ...prev,
                              get_missing_emails: v,
                            }))
                          }
                          id="terms"
                        />
                      </div>
                      {form.get_missing_emails ? (
                        <>
                          <div className="my-5 flex items-center justify-between">
                            <h1>First Name</h1>
                            <Select
                              onValueChange={(value) => {
                                setForm((prev) => ({
                                  ...prev,
                                  first_name_column_name: value,
                                }))
                              }}
                              // value={form.first_name_column_name}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Header Name" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <ScrollArea className="h-[200px]">
                                    {headers.map((header) => {
                                      return (
                                        //@ts-ignore
                                        <SelectItem value={header.value}>
                                          {
                                            //@ts-ignore
                                            header.name
                                          }
                                        </SelectItem>
                                      )
                                    })}
                                  </ScrollArea>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="my-5 flex  items-center justify-between">
                            <h1>Last Name</h1>
                            <Select
                              onValueChange={(value) => {
                                setForm((prev) => ({
                                  ...prev,
                                  last_name_column_name: value,
                                }))
                              }}
                              // value={form.last_name_column_name}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Header Name" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <ScrollArea className="h-[200px]">
                                    {headers.map((header) => {
                                      return (
                                        //@ts-ignore
                                        <SelectItem value={header.value}>
                                          {
                                            //@ts-ignore
                                            header.name
                                          }
                                        </SelectItem>
                                      )
                                    })}
                                  </ScrollArea>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>{" "}
                          <div className="my-5 flex  items-center justify-between">
                            <h1>Website</h1>
                            <Select
                              onValueChange={(value) => {
                                setForm((prev) => ({
                                  ...prev,
                                  domain_column_name: value,
                                }))
                              }}
                              // value={form.domain_column_name}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Header Name" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <ScrollArea className="h-[200px]">
                                    {headers.map((header) => {
                                      return (
                                        //@ts-ignore
                                        <SelectItem value={header.value}>
                                          {
                                            //@ts-ignore
                                            header.name
                                          }
                                        </SelectItem>
                                      )
                                    })}
                                  </ScrollArea>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between my-5">
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Include Generic Emails ?
                            </label>
                            <Checkbox
                              checked={form.include_generic_emails}
                              onCheckedChange={(v) =>
                                //@ts-ignore
                                setForm((prev) => ({
                                  ...prev,
                                  include_generic_emails: v,
                                }))
                              }
                              id="terms"
                            />
                          </div>
                          <div className="flex items-center justify-between my-5">
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Try Finding Failed Emails ?
                            </label>
                            <Checkbox
                              checked={form.brute_force_failed_emails}
                              onCheckedChange={(v) =>
                                //@ts-ignore
                                setForm((prev) => ({
                                  ...prev,
                                  brute_force_failed_emails: v,
                                }))
                              }
                              id="terms"
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={uploading}
                        onClick={async () => {
                          setUploading(true)
                          await uploadCSV()
                          setUploading(false)
                          setOpenSheet(false)
                        }}
                        className="w-full"
                      >
                        {uploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Upload List"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {files.length == 0 ? (
        <div className="grid min-h-screen place-items-center">
          <Button
            onClick={() => {
              setOpenSheet((prev) => !prev)
            }}
            size="lg"
          >
            Add List
          </Button>
        </div>
      ) : (
        <div>
          <div className="mx-auto my-10 flex w-[80vw] items-center justify-center">
            <Button
              onClick={() => {
                setOpenSheet((prev) => !prev)
              }}
              size="lg"
            >
              Add List
            </Button>
          </div>
          {/* <div className="mx-auto my-10 flex w-full flex-col items-center justify-center"> */}
          <div className="mx-auto my-10 flex w-full flex-col items-center justify-center">
            {files.map((file) => {
              return (
                <FileDisplayCard file={file} token={token}></FileDisplayCard>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
