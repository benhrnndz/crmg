import pandas as pd

df = pd.read_csv("tdp_applicants.csv")

public = df[["student_num", "last_name", "first_name", "middle_name"]].copy()
public["student_num"] = public["student_num"].astype(str).str.strip()
public["last_name"] = public["last_name"].fillna("").astype(str).str.strip()
public["first_name"] = public["first_name"].fillna("").astype(str).str.strip()
public["middle_name"] = public["middle_name"].fillna("").astype(str).str.strip()

public = public.dropna(subset=["student_num", "last_name", "first_name"]).drop_duplicates(subset=["student_num"], keep="first")
public = public.reset_index(drop=True)

public.to_json("applicants.json", orient="records", force_ascii=False)