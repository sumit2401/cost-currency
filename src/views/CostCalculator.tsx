import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import logo from "../assets/logo.png";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CountryAutoSearch } from "../components/CountryAutoSearch";
import { CustomTextField } from "../components/CustomTextField";

interface FormData {
  Client_Invoice_Currency: string;
  gross_annual_salary_in_client_invoice_currency: string;
  Country_of_Employment: string;

  Monthly_Management_Fee_in_Client_Invoice_Currency: string;
  FX_Rate: string;
}

function CostCalculator() {
  const [fetchedData, setFetchedData] = useState<any>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedClient, setselectedClient] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  // const [countries, setCountries] = useState<string[]>([]);

  const {
    values,
    handleChange,
    handleSubmit,

    setValues,
  } = useFormik<FormData>({
    initialValues: {
      Client_Invoice_Currency: "",
      gross_annual_salary_in_client_invoice_currency: "20000",
      Country_of_Employment: "",
      Monthly_Management_Fee_in_Client_Invoice_Currency: "200",
      FX_Rate: "",
    },
    validate: (values) => {
      const errors: Partial<FormData> = {};
      if (
        !values.Client_Invoice_Currency ||
        !values.Country_of_Employment ||
        !values.FX_Rate ||
        !values.gross_annual_salary_in_client_invoice_currency
      ) {
        errors.Client_Invoice_Currency = "Client Invoice Currency is required";
        errors.Country_of_Employment = "Country is required";
        errors.FX_Rate = "FX rate is required";
        errors.gross_annual_salary_in_client_invoice_currency =
          "Client Invoice salary is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          client_invoice_currency: values.Client_Invoice_Currency,
          gross_annual_salary_in_client_invoice_currency:
            values.gross_annual_salary_in_client_invoice_currency,
          country_of_employment: values.Country_of_Employment,
          fx_rate: parseFloat(values.FX_Rate),
        };

        const response = await axios.post(
          "https://api.1eor.com/api/v1/costcalculator/upsert-costcalculator-key",
          payload,
          {
            headers: {
              key: "sR3pK@t8qF!zW7dV#oHg2eX$uYtM5fR6nA!jB9cDmT#pL@wO4",
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

  console.log(values, "values");

  const dataArray = Object.entries(fetchedData)
    .slice(0, -2)
    .map(([category, values]) => {
      return {
        category: category,
        //@ts-expect-error description
        currency_one: Object.values(values)[0],
        //@ts-expect-error description
        currency_two: Object.values(values)[1],
      };
    });

  //for total values
  const lastdataArray = Object.entries(fetchedData)
    .slice(-2)
    .map(([category, values]) => {
      return {
        category: category,
        //@ts-expect-error description
        currency_one: Object.values(values)[0],
        //@ts-expect-error description
        currency_two: Object.values(values)[1],
      };
    });

  console.log(dataArray);

  return (
    <>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ height: 60 }}
        >
          <img src={logo} alt="" />
          <Typography alignContent="center" fontWeight={700}>
            Global Employer Cost Calculator
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
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
                id="Client_Invoice_Currency"
                sx={{ width: 300, height: 40, backgroundColor: "lightgray" }}
                name="Client_Invoice_Currency"
                value={values.Client_Invoice_Currency}
                onChange={handleChange}
              >
                <MenuItem value=""></MenuItem>
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
                Gross Annual Salary in Client Invoice Currency*
              </Typography>
              <CustomTextField
                id="gross_annual_salary_in_client_invoice_currency"
                sx={{ width: 300, backgroundColor: "skyblue" }}
                heading={"Website"}
                type="text"
                fullWidth
                value={values.gross_annual_salary_in_client_invoice_currency}
                onChange={handleChange}
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
                // value={{ country_name: values.Country_of_Employment }}
                onSelect={(value) => {
                  setValues({
                    ...values,
                    Country_of_Employment: value.country_name,
                  });
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
                Monthly Management Fee- in Client Invoice Currency
              </Typography>
              <CustomTextField
                id="  Monthly_Management_Fee_in_Client_Invoice_Currency"
                sx={{ width: 300, backgroundColor: "skyblue" }}
                heading={"Website"}
                type="text"
                fullWidth
                value={200}
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
                id="FX_Rate"
                sx={{ width: 300, backgroundColor: "skyblue" }}
                heading={"Website"}
                type="text"
                fullWidth
                value={values.FX_Rate}
                onChange={handleChange}
              />
            </Stack>
          </Box>
          <Stack alignItems="end" marginTop={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#002060" }}
            >
              Submit
            </Button>
          </Stack>
        </form>

        {submitted && selectedClient && selectedCountry && (
          <Paper className="mt-8 p-4">
            <Typography
              variant="h6"
              color="white"
              sx={{ bgcolor: "#002060", marginTop: 4 }}
            >
              Monthly Employer Costs
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }} className="text-left">
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900 }} align="center">
                      {selectedClient}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900 }} align="center">
                      {selectedCountry}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataArray?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="center">
                        {item.currency_one}
                      </TableCell>{" "}
                      <TableCell align="center">{item.currency_two}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <Box height={300}></Box>
                <TableBody sx={{ backgroundColor: "lightgray" }}>
                  {lastdataArray?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {item.category}
                      </TableCell>
                      <TableCell align="center">{item.currency_one}</TableCell>
                      <TableCell align="center">{item.currency_two}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </>
  );
}

export default CostCalculator;
