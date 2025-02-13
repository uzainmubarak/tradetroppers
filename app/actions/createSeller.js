"use server"

export const createSeller = async (formData) => {

  try {
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/buyer/", 
      {
        method: "POST",
        body: formData,
      }
    );
    return { success: true, message: "Seller created successfully", data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
}
