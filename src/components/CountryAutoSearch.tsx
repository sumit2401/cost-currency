import { Autocomplete, CircularProgress } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";
import React from "react";
import { CustomTextField } from "./CustomTextField";

interface ICountry {
  country_uuid: string | null;
  country_name: string;
  country_currency: string;
  status: string;
}

const initialialCountry: ICountry = {
  country_uuid: null,
  country_name: "",
  country_currency: "",
  status: "ACTIVE",
};

const INITIAL_STATE: ICountry = initialialCountry;
interface ICountryAutoSearch {
  label?: string;
  // value: { country_name: string; } | null;
  onSelect: (value: ICountry) => void;
  disabled?: boolean;
  error?: string;
}

export const CountryAutoSearch: React.FC<ICountryAutoSearch> = (props) => {
  const { onSelect, disabled, error } = props;
  // states
  const [options, setOptions] = React.useState<readonly ICountry[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openData, setOpenData] = React.useState<boolean>(false);
  const [search, setSearchText] = React.useState("");
  // const dispatch = useDispatchWrapper()
  // fetch options from api
  const fetchSuggestion = async (searchValue: string) => {
    setLoading(true);
    try {
      let apiEndpoint = "";
      if (searchValue.length > 0) {
        apiEndpoint = `?value=${searchValue}&columns=country_name`;
      }
      const res = await axios.get(
        `https://api.1eor.com/api/v1/country/get-country${apiEndpoint}`
      );
      const data: ICountry[] = res.data.result;
      setOptions(data);
      console.log(res.data.result, "res.data.result");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);

  //get option label
  const getOptionLabel = (option: string | ICountry) => {
    if (typeof option === "string") return option;
    return `${option.country_name || ""}`;
  };

  React.useEffect(() => {
    if (openData) {
      debounceFn(search);
    }
  }, [openData, search]);

  return (
    <>
      <Autocomplete
        id="vendor-auto-search"
        freeSolo
        options={options}
        // value={getValueLabel(getValue())}
        getOptionLabel={getOptionLabel}
        noOptionsText="No Vendor"
        filterOptions={(x) => x}
        onFocus={() => setOpenData(true)}
        loading={loading}
        //@ts-expect-error description
        onChange={(
          event: React.ChangeEvent<HTMLElement>,
          newValue: ICountry | null
        ) => {
          if (newValue) {
            const isOptionExists = options.some(
              (option) => option.country_name === newValue.country_name
            );
            setOptions(isOptionExists ? options : [newValue, ...options]);
            onSelect(newValue);
          } else {
            onSelect(INITIAL_STATE);
          }
        }}
        autoComplete
        includeInputInList
        onInputChange={(event, newInputValue) => {
          if ((event && event.type === "change") || !newInputValue) {
            setSearchText(newInputValue);
          }
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            paddingTop: "2px",
            paddingBottom: "2px",
            fontSize: "0.8rem",
            color: "rgb(38, 38, 38)",
            width: "100%",
          },
        }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            fullWidth
            sx={{ width: 300, backgroundColor: "skyblue" }}
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
          typeof option === "string"
            ? option === value
            : option.country_name === value.country_name
        }
      />
    </>
  );
};
