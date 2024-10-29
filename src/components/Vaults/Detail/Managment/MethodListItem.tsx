import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  FormGroup,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TransactionResponseDataList from "@/components/Vaults/Detail/Managment/TransactionResponseDataList";
import { STATE_MUTABILITY_TRANSACTIONS } from "@/components/Vaults/Detail/Managment/ManagementVaultMethodList";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import {
  BaseFormTextField,
  BaseFormInputLabel,
} from "@/components/Base/Form/StyledForm";

enum MethodType {
  View = "view",
  Mutate = "mutate",
}

const EMPTY_FIELD_NAME = "noname";

const MethodResponseStyled = styled(Box)`
  position: relative;
  width: calc(100% - 122px);
  font-size: 14px;
  font-weight: 500;
  word-wrap: break-word;
  padding-top: 4px;

  &.writeMethodRes {
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const MethodListItemAccordion = styled(Accordion)`
  border-bottom: 1px solid #476182;
  box-shadow: none;
  padding: 0;
  overflow: hidden;

  &.MuiAccordion-root {
    &:before {
      background: none;
    }
  }

  &.Mui-expanded {
    margin: 0;
  }

  & .MuiAccordionSummary-content.Mui-expanded {
    margin: unset;
  }

  & .MuiCollapse-root {
    background: #2e3a4c;
    padding: 0 24px;
  }

  & .MuiAccordionDetails-root {
    padding: 16px 0;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiAccordionSummary-content {
      p {
        font-size: 12px;
      }
    }
  }
`;

const AccordionSummaryStyled = styled(AccordionSummary)`
  min-height: 48px;
  padding: 8px 24px;

  .MuiAccordionSummary-content {
    gap: 16px;
    display: flex;
    align-items: center;
    margin: 0;
  }

  &.Mui-expanded {
    min-height: 48px;
    margin: 0;
  }
`;

const MethodInputFormGroup = styled(FormGroup)`
  margin-bottom: 14px;

  & .MuiFormLabel-root {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 4px;
  }

  & .MuiInputBase-root {
    border: none;
  }
  & .MuiTextField-root textarea {
    background: transparent;
    border-radius: 8px;
    border: 1px solid #6d86b2;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    padding: 8px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiFormLabel-root {
      font-size: 12px;
    }

    & .MuiTextField-root textarea {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
`;

export const ReadeMethodIcon = ({ color = "#2C4066" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 22H5C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H15C16.6569 2 18 3.34315 18 5V8M20 22C18.8954 22 18 21.1046 18 20V8M20 22C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8H18M6 7H14M6 12H14M6 17H10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const WriteMethodIcon = ({ color = "#2C4066" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.75 5C1.75 3.20507 3.20507 1.75 5 1.75H11C11.4142 1.75 11.75 1.41421 11.75 1C11.75 0.585786 11.4142 0.25 11 0.25H5C2.37665 0.25 0.25 2.37665 0.25 5V17C0.25 19.6234 2.37665 21.75 5 21.75H17C19.6234 21.75 21.75 19.6234 21.75 17V11C21.75 10.5858 21.4142 10.25 21 10.25C20.5858 10.25 20.25 10.5858 20.25 11V17C20.25 18.7949 18.7949 20.25 17 20.25H5C3.20507 20.25 1.75 18.7949 1.75 17V5ZM15.419 1.67708C16.3218 0.774305 17.7855 0.774305 18.6883 1.67708L20.3229 3.31171C21.2257 4.21449 21.2257 5.67818 20.3229 6.58096L18.8736 8.03028C18.7598 7.97394 18.6401 7.91302 18.516 7.84767C17.6806 7.40786 16.6892 6.79057 15.9493 6.05069C15.2095 5.31082 14.5922 4.31945 14.1524 3.48403C14.087 3.35989 14.0261 3.24018 13.9697 3.12639L15.419 1.67708ZM14.8887 7.11135C15.7642 7.98687 16.8777 8.67594 17.7595 9.14441L12.06 14.8438C11.7064 15.1975 11.2475 15.4269 10.7523 15.4977L7.31963 15.9881C6.5568 16.097 5.90295 15.4432 6.01193 14.6804L6.50231 11.2477C6.57305 10.7525 6.80248 10.2936 7.15616 9.93996L12.8556 4.24053C13.3241 5.12234 14.0131 6.23582 14.8887 7.11135Z"
        fill={color}
      />
    </svg>
  );
};

const MethodListItem: FC<{
  method: any;
  contractAddress: string;
  index: number;
}> = ({ method, contractAddress, index }) => {
  const { formState, control, handleSubmit, getValues } = useForm({
    defaultValues: {},
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const [methodType, setMethodType] = useState<MethodType>(MethodType.View);
  const [response, setResponse] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const methodType = STATE_MUTABILITY_TRANSACTIONS.includes(
      method.stateMutability
    )
      ? MethodType.Mutate
      : MethodType.View;

    setMethodType(methodType);
  }, [contractAddress, method, setMethodType]);

  const handleSubmitForm = useCallback(async () => {
    alert("submit");
  }, [formState, methodType, method, getValues]);

  return (
    <MethodListItemAccordion>
      <AccordionSummaryStyled
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: "#A9BAD0", width: "24px", height: "24px" }}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {methodType === MethodType.View && <ReadeMethodIcon color="#A9BAD0" />}
        {methodType === MethodType.Mutate && (
          <WriteMethodIcon color="#A9BAD0" />
        )}
        <Typography>{`${index + 1}. ${method.name}`}</Typography>
      </AccordionSummaryStyled>
      <AccordionDetails>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
          autoComplete="off"
        >
          {method.inputs.map((input) => (
            <Controller
              key={input.name}
              name={
                input.name !== ""
                  ? (input.name as never)
                  : (EMPTY_FIELD_NAME as never)
              }
              rules={{ required: input.type !== "address[]" }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MethodInputFormGroup>
                  <BaseFormInputLabel>{`${input.name} (${input.type}${
                    input.type === "uint256" ? " in wei" : ""
                  })`}</BaseFormInputLabel>
                  <BaseFormTextField
                    error={!!error}
                    multiline
                    rows={1}
                    {...field}
                  />
                </MethodInputFormGroup>
              )}
            />
          ))}
          {method.stateMutability === "payable" && (
            <Controller
              key="value"
              name={"value" as never}
              rules={{ required: true }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MethodInputFormGroup>
                  <BaseFormInputLabel>XDC value</BaseFormInputLabel>
                  <BaseFormTextField
                    error={!!error}
                    multiline
                    rows={1}
                    {...field}
                  />
                </MethodInputFormGroup>
              )}
            />
          )}
          <FlexBox
            sx={{
              flexDirection:
                methodType === MethodType.Mutate ? "column-reverse" : "row",
              justifyContent:
                methodType === MethodType.Mutate
                  ? "flex-start"
                  : "space-between",
              alignItems:
                methodType === MethodType.Mutate ? "flex-end" : "flex-start",
            }}
          >
            <MethodResponseStyled
              className={
                methodType === MethodType.Mutate
                  ? "writeMethodRes"
                  : "viewMethodRes"
              }
            >
              {response !== undefined && <>{renderResponse()}</>}
            </MethodResponseStyled>
            <Button
              variant="contained"
              sx={{
                fontSize: "12px",
                width: "80px",
                height: "28px",
                marginTop: 0,
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : "Execute"}
            </Button>
          </FlexBox>
        </Box>
      </AccordionDetails>
    </MethodListItemAccordion>
  );
};

export default memo(MethodListItem);
