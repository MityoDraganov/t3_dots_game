"use client";

import { ChangeEvent, useState } from "react";

export type FormDataChangeEvent =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  | { id: string; value: any }
  | FileList;

const useFormData = <T extends {}>(
  initialValues: T
): [
  T,
  (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { id: string; value: any }
      | FileList
  ) => void
] => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { id: string; value: any }
      | FileList
  ) => {
    if ("target" in e) {
      const { id, value, type } = e.target;
      if (type === "file") {
        // Handle file input
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          // Convert FileList to an array
          const filesArray: File[] = Array.from(files);
          setFormData((prevState) => ({
            ...prevState,
            [id]: filesArray, // Store files as an array
          }));
        }
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      }
    } else if ("id" in e && "value" in e) {
      const { id, value } = e;
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  return [formData, handleChange];
};

export default useFormData;