#!/usr/bin/env python
import csv
import json
import numpy as np
import numpy.matlib
row1 = 0

headers = ["food_id", "food_grp", "food_long_desc", "food_short_desc", "nutrient_ids",
           "nutrient_values", "nutrient_tagname", "nurtient_desc", "nutrient_units"]

def get_json_obj(row):
    j = {}
    for i in range(0, len(headers)):
        j[headers[i]] = row[i]

    nutrient_ids = j["nutrient_ids"]
    nutrient_values = j["nutrient_values"]
    nurtient_desc = j["nurtient_desc"]
    nutrient_units = j["nutrient_units"]

    nutrient_ids = nutrient_ids.split('|')
    nutrient_values = nutrient_values.split('|')
    nurtient_desc = nurtient_desc.split('|')
    nutrient_units = nutrient_units.split('|')

    nutrients = {}
    for i in range(0, len(nutrient_ids)):
        nut_obj = {}
        nut_obj["id"] = nutrient_ids[i]
        nut_obj["value"] = nutrient_values[i]
        nut_obj["unit"] = nutrient_units[i]
        nutrients[nurtient_desc[i]] = nut_obj
    j["nutrients"] = nutrients
    del j["nutrient_ids"]
    del j["nutrient_values"]
    del j["nurtient_desc"]
    del j["nutrient_units"]
    del j["nutrient_tagname"]
    return j

def get_food_id(row):
    id = get_json_obj(row)["food_id"]
    return id

def get_features(row):
    features = []
    obj = get_json_obj(row)["nutrients"]
    features.append(get_calories(obj))
    features.append(get_total_fat(obj))
    features.append(get_sat_fat(obj))
    features.append(get_poly_fat(obj))
    features.append(get_mono_fat(obj))
    features.append(get_trans_fat(obj))
    features.append(get_cholesterol(obj))
    features.append(get_sodium(obj))
    features.append(get_potassium(obj))
    features.append(get_carbs(obj))
    features.append(get_fiber(obj))
    features.append(get_sugar(obj))
    features.append(get_protein(obj))
    features.append(get_vita(obj))
    features.append(get_vitc(obj))
    features.append(get_calcium(obj))
    features.append(get_iron(obj))
    return features

def get_total_fat(obj):
    fat_value = 0
    if "Total lipid (fat)" in obj:
        fat_value = obj["Total lipid (fat)"]["value"]
    return float(fat_value)

def get_poly_fat(obj):
    poly_fat = 0
    if "Fatty acids, total polyunsaturated" in obj:
        poly_fat = obj["Fatty acids, total polyunsaturated"]["value"]
    return float(poly_fat)

def get_mono_fat(obj):
    mono_fat = 0
    if "Fatty acids, total monounsaturated" in obj:
        mono_fat = obj["Fatty acids, total monounsaturated"]["value"]
    return float(mono_fat)

def get_trans_fat(obj):
    trans_fat = 0
    if "Fatty acids, total trans-polyenoic" in obj:
        trans_fat = obj["Fatty acids, total trans-polyenoic"]["value"]
    return float(trans_fat)

def get_sat_fat(obj):
    sat_fat = 0
    if "Fatty acids, total saturated" in obj:
        sat_fat = obj["Fatty acids, total saturated"]["value"]
    return float(sat_fat)

def get_cholesterol(obj):
    cholesterol = 0
    if "Cholesterol" in obj:
        cholesterol = obj["Cholesterol"]["value"]
    return float(cholesterol)

def get_sodium(obj):
    sodium = 0
    if "Sodium, Na" in obj:
        sodium = obj["Sodium, Na"]["value"]
    return float(sodium)

def get_potassium(obj):
    potassium = 0
    if "Potassium, K" in obj:
        potassium = obj["Potassium, K"]["value"]
    return float(potassium)

def get_carbs(obj):
    carbs = 0
    if "Carbohydrate, by difference" in obj:
        carbs = obj["Carbohydrate, by difference"]["value"]
    return float(carbs)

def get_fiber(obj):
    fiber = 0
    if "Fiber, total dietary" in obj:
        fiber = obj["Fiber, total dietary"]["value"]
    return float(fiber)

def get_sugar(obj):
    sugar = 0
    if "Sugars, total" in obj:
        sugar = obj["Sugars, total"]["value"]
    return float(sugar)

def get_protein(obj):
    protein = 0
    if "Protein" in obj:
        protein = obj["Protein"]["value"]
    return float(protein)

def get_vita(obj):
    vita = 0
    if "Vitamin A, RAE" in obj:
        vita = obj["Vitamin A, RAE"]["value"]
    return float(vita)

def get_vitc(obj):
    vitc = 0
    if "Vitamin C, total ascorbic acid" in obj:
        vitc = obj["Vitamin C, total ascorbic acid"]["value"]
    return float(vitc)

def  get_calcium(obj):
    calcium = 0
    if "Calcium, Ca" in obj:
        calcium = obj["Calcium, Ca"]["value"]
    return float(calcium)

def get_iron(obj):
    iron = 0
    if "Iron, Fe" in obj:
        iron = obj["Iron, Fe"]["value"]
    return float(iron)

def get_calories(obj):
    energy_value = 0
    if "Energy" in obj:
        energy_value = obj["Energy"]["value"]
        energy_unit = obj["Energy"]["unit"]
        energy_value = float(energy_value)
        if energy_unit.lower() == "kj":
            energy_value *= .239005736
    return energy_value

def main():
    data = []
    ids = []
    csvfile = open('query_result.csv', 'rb')
    reader = csv.reader(csvfile, delimiter=',', quotechar='"', escapechar="\\")
    count = 0
    data_file_out = open('nut_norm_features.json', 'w')
    for row in reader:
        processed_id = get_food_id(row)
        processed_row = get_features(row)
        data.append(processed_row)
        ids.append(processed_id)
        count += 1

    data = np.array(data)
    mu = data.mean(0)
    s = data.std(0)
    mu = numpy.matlib.repmat(mu, len(data), 1)
    s = numpy.matlib.repmat(s, len(data), 1)
    data = data-mu
    data = np.divide(data, s)
    data = data.tolist()

    features_json = []
    for i in range(0,len(ids)):
        example = {}
        example["id"] = ids[i]
        features = []
        for f in data[i]:
            features.append(f)
        example["features"] = features
        features_json.append(example)
    data_file_out.write(json.dumps(features_json))
    data_file_out.close()
    print count

if __name__ == "__main__":
    main()