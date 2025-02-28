import axios from "axios";
import api from "../constants/api";
import { CustomerRequest } from "../types/customer";
export const getCustomersService = async () => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message,
      data: "",
    };
  }
};

export const importCustomersService = async (data: FormData) => {
  try {
    const response = await axios.post(`${api}/import`, data);
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message,
      data: "",
    };
  }
};

export const deleteCustomerService = async (id: number) => {
  try {
    const response = await axios.delete(`${api}/${id}`);
    return {
      message: response.data.message,
      // data: ,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message,
      data: null,
    };
  }
};

export const exportCustomersService = async () => {
  try {
    const response = await axios.get(`${api}/export`);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message,
      data: "",
    };
  }
};

export const checkInCustomerService = async (qrCode: string) => {
  try {
    const response = await axios.post(`${api}/check-in`, { qrCode });
    const { data } = response.data;
    return {
      message: "success",
      data,
    };
  } catch (error: any) {
    console.error("Check-in error:", error);

    // Default error message
    let errorMessage = "An unexpected error occurred";

    // Handle errors with response
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        errorMessage = "Khách hàng không tồn tại";
      } else if (status === 409) {
        errorMessage = "Khách hàng đã check-in";
      } else if (status === 500) {
        errorMessage = "Something went wrong";
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request was made, but no response received
      errorMessage = "Server không phản hồi, vui lòng thử lại sau";
    } else {
      // Something happened while setting up the request
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      data: error.response?.data?.data,
    };
  }
};

export const getDashboardService = async () => {
  try {
    const response = await axios.get(`${api}/dashboard`);
    console.log(response);
    const { message, data } = response.data;
    return {
      message:
        message === "success" ? "success" : "An unexpected error occurred",
      data,
    };
  } catch (error) {
    return {
      message: "An unexpected error occurred",
      data: null,
    };
  }
};

export const createCustomerService = async (customer: CustomerRequest) => {
  try {
    const response = await axios.post(`${api}`, customer);
    const { message, data } = response.data;
    return {
      message:
        message === "success" ? "success" : "An unexpected error occurred",
      data,
    };
  } catch (error) {
    return {
      message: "An unexpected error occurred",
      data: null,
    };
  }
};

export const updateCustomerService = async (customer: CustomerRequest) => {
  try {
    const response = await axios.put(`${api}/${customer.id}`, customer);
    const { message, data } = response.data;
    return {
      message:
        message === "success" ? "success" : "An unexpected error occurred",
      data,
    };
  } catch (error) {
    return {
      message: "An unexpected error occurred",
      data: null,
    };
  }
};
