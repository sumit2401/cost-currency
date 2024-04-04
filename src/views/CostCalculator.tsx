import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useFormik } from "formik";
// import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { CustomTextField } from "../components/CustomTextField";
import { CountryAutoSearch } from "../components/CountryAutoSearch";

interface FormData {
  Client_Invoice_Currency: string;
  Gross_annual_salary_in_Client_Invoice_Currency: string;
  Country_of_Employment: string;
  Gross_annual_salary_in_Local_currency: string;
  Monthly_Management_Fee_in_Client_Invoice_Currency: string;
  FX_Rate: string;
}

function CostCalculator() {
  const [fetchedData, setFetchedData] = useState<any>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedClient, setselectedClient] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
    setValues,
  } = useFormik<FormData>({
    initialValues: {
      Client_Invoice_Currency: "",
      Gross_annual_salary_in_Client_Invoice_Currency: "",
      Country_of_Employment: "",
      Gross_annual_salary_in_Local_currency: "",
      Monthly_Management_Fee_in_Client_Invoice_Currency: "",
      FX_Rate: "",
    },
    validate: (values) => {
      const errors: Partial<FormData> = {};
      if (
        !values.Client_Invoice_Currency ||
        !values.Country_of_Employment ||
        !values.FX_Rate ||
        !values.Gross_annual_salary_in_Client_Invoice_Currency
      ) {
        errors.Client_Invoice_Currency = "Client Invoice Currency is required";
        errors.Country_of_Employment = "Country is required";
        errors.FX_Rate = "FX rate is required";
        errors.Gross_annual_salary_in_Client_Invoice_Currency =
          "Client Invoice salary is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          client_invoice_currency: values.Client_Invoice_Currency,
          gross_annual_salary_in_client_invoice_currency:
            values.Gross_annual_salary_in_Client_Invoice_Currency,
          country_of_employment: values.Country_of_Employment,
          fx_rate: parseFloat(values.FX_Rate),
        };

        const response = await axios.post(
          "https://api.1eor.com/api/v1/costcalculator/upsert-costcalculator-key",
          payload,
          {
            headers: {
              key: " sR3pK@t8qF!zW7dV#oHg2eX$uYtM5fR6nA!jB9cDmT#pL@wO4",
            },
          }
        );
        setFetchedData(response.data.data);
        setSubmitted(true);
        setselectedClient(values.Client_Invoice_Currency);
        setSelectedCountry(values.Country_of_Employment);
      } catch (error) {
        console.error("Error:", error);
      }
      console.log("Form submitted with values:", values);
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://api.1eor.com/api/v1/country/get-country?pageNo=1&itemPerPage=200"
        );
        const countries = response.data.result.map(
          (country: any) => country.country_name
        );
        setFieldValue("Country_of_Employment", countries[0]); // Set the default selected country
        setCountries(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [setFieldValue]);

  const handleCountrySelect = (selectedCountry) => {
    console.log("Selected Country:", selectedCountry);

    setValues({
      ...values,
      Country_of_Employment: selectedCountry.country_name,
    });
    // Do something with the selected country
  };

  return (
    <>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ height: 60 }}
        >
          <img src={logo} alt="" />
          <Typography alignContent="center">
            Gloabl Employer Cost Calculator
          </Typography>
        </Stack>
        <Box border={2} borderColor="gray">
          <Typography variant="h6" color="white" sx={{ bgcolor: "#002060" }}>
            Client Employee Variables
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            sx={{ border: 1 }}
          >
            <Typography
              variant="body1"
              alignContent="center"
              sx={{ marginLeft: 2 }}
            >
              Client Invoice Currency*{" "}
            </Typography>
            <Select
              sx={{ width: 300, height: 40, backgroundColor: "lightgray" }}
            >
              <MenuItem value="AUSTRALIAN DOLLAR">AUSTRALIAN DOLLAR</MenuItem>
              <MenuItem value="BRITISH POUND">BRITISH POUND</MenuItem>
              <MenuItem value="CANADIAN DOLLAR">CANADIAN DOLLAR</MenuItem>
              <MenuItem value="EURO"> EURO</MenuItem>
              <MenuItem value="US DOLLAR">US DOLLAR</MenuItem>
            </Select>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            sx={{ border: 1 }}
          >
            <Typography variant="body1" alignContent="center">
              Gross annual salary in Client Invoice Currency*
            </Typography>
            <CustomTextField
              sx={{ width: 300, backgroundColor: "skyblue" }}
              heading={"Website"}
              type="text"
              id="website"
              fullWidth
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ border: 1 }}
          >
            <Typography variant="body1" alignContent="center">
              Country of Employment*{" "}
            </Typography>
            <CountryAutoSearch
              // sx={{ width: 300, backgroundColor: "skyblue" }}
              value={selectedCountry}
              onSelect={(value) => {
                setSelectedCountry(value);
              }}
              // error={errors.Country_of_Employment}
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            sx={{ border: 1 }}
          >
            <Typography variant="body1" alignContent="center">
              FX Rate*
            </Typography>
            <CustomTextField
              sx={{ width: 300, backgroundColor: "skyblue" }}
              heading={"Website"}
              type="text"
              id="website"
              fullWidth
            />
          </Stack>
        </Box>
        <Stack alignItems="end" marginTop={2}>
          <Button variant="contained" sx={{ backgroundColor: "#002060" }}>
            Submit
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default CostCalculator;
