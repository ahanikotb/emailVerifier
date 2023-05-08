import React, { useEffect, useState } from "react"
import Placeholder from "@tiptap/extension-placeholder"
// src/Tiptap.jsx
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"

import "./style.css"
import { CurlyBraces } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Separator } from "../ui/separator"

function EmailEditor({ selectedStep, sequences }) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [subjectPlaceholder, setSubjectPlaceholder] = useState("Your subject")
  useEffect(() => {
    if (sequences[selectedStep.step] != undefined) {
      if (
        sequences[selectedStep.step].variants[selectedStep.variant] == undefined
      ) {
        return
      }
      setBody(sequences[selectedStep.step].variants[selectedStep.variant].body)
      const subj =
        sequences[selectedStep.step].variants[selectedStep.variant].subject

      if (subj == "") {
        if (selectedStep.step == 0) {
          setSubjectPlaceholder("Your subject")
        } else {
          setSubjectPlaceholder("Leave empty to use previous step's subject")
        }
        setSubject("")
      } else {
        setSubject(subj)
      }
    }
  }, [selectedStep, sequences])

  const emailEditor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start typing here...",
        }),
      ],
      content: body,
    },
    [body]
  )
  const subjectEditor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: subjectPlaceholder,
        }),
      ],
      content: subject,
    },
    [subject, subjectPlaceholder]
  )

  // console.log(emailEditor?.contentComponent?.state)
  return (
    <Card className="max-w-2/3 mx-10 min-h-[80vh] w-2/3">
      <CardContent>
        <div className="grid grid-cols-10 place-content-center px-4 py-5 pt-10">
          <h1 className="font-bold text-gray-400">Subject</h1>
          <EditorContent
            className="col-span-4 col-start-2"
            editor={subjectEditor}
          />
          <Separator className=" col-start-8" orientation="vertical" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" col-start-9 w-[4rem]">
                <CurlyBraces />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={() =>
                  setSubject(subjectEditor?.getText() + "{{firstName}}")
                }
              >
                First Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className=" col-start-10 ">Save</Button>
        </div>

        <Separator orientation="horizontal" />
        <div className="p-10">
          <EditorContent
            className=" scrollbar-hide h-[50vh] overflow-y-scroll"
            editor={emailEditor}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Toggle
          onClick={() => emailEditor?.chain().focus().toggleBold().run()}
          aria-label="Toggle italic "
          data-state={
            !emailEditor?.can().chain().focus().toggleBold().run()
              ? "on"
              : "off"
          }
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => emailEditor?.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic "
          data-state={
            !emailEditor?.can().chain().focus().toggleBold().run()
              ? "on"
              : "off"
          }
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </CardFooter>
    </Card>
  )
}

export default EmailEditor
