import React, { useState, useEffect } from "react";
import { Autocomplete, CircularProgress, FormLabel } from "@mui/material";
import axios from "axios";
import { debounce } from "lodash";
import { CustomTextField } from "./CustomTextField";

interface ICountry {
  country_uuid: string | null;
  country_name: string;
  country_currency: string;
  status: string;
}

const initialCountry: ICountry = {
  country_uuid: null,
  country_name: "",
  country_currency: "",
  status: "ACTIVE",
};

interface ICountryAutoSearch {
  label: string;
  value: ICountry | null;
  onSelect: (value: ICountry) => void;
  disabled?: boolean;
  error?: string;
}

export const CountryAutoSearch: React.FC<ICountryAutoSearch> = (props) => {
  const { label, value, onSelect, disabled, error } = props;

  const [options, setOptions] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchSuggestion = async (searchValue: string) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.1eor.com/api/v1/country/get-country?value=${searchValue}&columns=country_name`
        );
        const data: ICountry[] = res.data.data;
        setOptions(data || []); // Ensure options is always an array
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFn = debounce(fetchSuggestion, 800);

    if (search) {
      debounceFn(search);
    }
  }, [search]);

  return (
    <>
      <FormLabel display={"block"}>{label}</FormLabel>
      <Autocomplete
        id="country-auto-search"
        freeSolo
        options={options || []} // Ensure options is always an array
        value={value}
        getOptionLabel={(option: ICountry) => option.country_name}
        noOptionsText="No Country"
        filterOptions={(x) => x} // Guard against undefined
        loading={loading}
        onChange={(_, newValue: ICountry | null) => {
          onSelect(newValue || initialCountry);
        }}
        autoComplete
        includeInputInList
        onInputChange={(event, newInputValue) => {
          setSearchText(newInputValue);
        }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            disabled={disabled}
            error={error ? true : false}
            helperText={error}
          />
        )}
        isOptionEqualToValue={(option, value) =>
          option.country_name === value?.country_name
        }
      />
    </>
  );
};
