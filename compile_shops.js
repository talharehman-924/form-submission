const fs = require('fs');

const existing_shops = [
  { "name": "Ac Repair and Service Centre", "address": "Near Taltala, Kolkata, West Bengal 700016, India", "mobile": "+91 62908 75643" },
  { "name": "A TO Z COOLING CENTER", "address": "Kolkata, West Bengal, India", "mobile": "+91 98307 68650" },
  { "name": "Chill Point Car AC Care", "address": "AF 228, Near 7 No, Rabindrapally, Kestopur, Kolkata, West Bengal 700102, India", "mobile": "+91 98308 02491" },
  { "name": "Starlite Service Centre", "address": "Chowringhee North, Bow Barracks, Kolkata, West Bengal 700013, India", "mobile": "" },
  { "name": "Royal Refrigeration Showroom", "address": "20 A, Haji Md. Mohsin Square, Taltala, Kolkata, West Bengal 700016, India", "mobile": "+91 90511 50837" },
  { "name": "Shyama Automobiles", "address": "23, Crematorium St, Beniapukur, Kolkata, West Bengal 700014, India", "mobile": "+91 93309 90347" },
  { "name": "Technology infinity", "address": "52A, Biplabi Anukul Chandra St, Bowbazar, Kolkata, West Bengal 700072, India", "mobile": "+91 91639 46313" },
  { "name": "Technology Infinity", "address": "95A, Narkeldanga N Rd, Ward Number 11, Kolkata, West Bengal 700011, India", "mobile": "+91 91639 46313" },
  { "name": "AC Repairing and Servicing", "address": "107, Ripon St, Esplanade, Taltala, Kolkata, West Bengal 700016, India", "mobile": "+91 82409 34715" },
  { "name": "N S COOLING SERVICE", "address": "31, Pemantle St, Kolkata, West Bengal 700016, India", "mobile": "" },
  { "name": "Jitco Technolab(Kolkata)", "address": "DumDum Rd, Kolkata, West Bengal 700030, India", "mobile": "+91 82406 69600" },
  { "name": "G S DISTRIBUTOR - AC DEALER", "address": "157 B, Lenin Sarani Rd, Chandni Chawk, Bowbazar, Kolkata, West Bengal 700072, India", "mobile": "+91 62908 81433" },
  { "name": "Technology Infinity (Park St)", "address": "57, Park St, Park Street area, Kolkata, West Bengal 700016, India", "mobile": "+91 91639 46313" },
  { "name": "Milon Aircon", "address": "Kolkata, West Bengal, India", "mobile": "+91 83348 66149" },
  { "name": "HLS COOLING CENTRE", "address": "Princep St, Kolkata, West Bengal 700072, India", "mobile": "" },
  { "name": "Ranajit Electric & Electronics", "address": "16 Phears Lane, near MEDICAL COLLEGE, Bowbazar, Kolkata, West Bengal 700012, India", "mobile": "+91 80133 61910" },
  { "name": "Shree Ganpati Refrigeration", "address": "23, Chittaranjan Ave, Taltala, Kolkata, West Bengal 700001, India", "mobile": "+91 98317 66227" },
  { "name": "Raul Refrigeration", "address": "Kolkata, West Bengal, India", "mobile": "+91 87775 79186" },
  { "name": "A. R. Indec", "address": "1B, Chatu Babu Ln, Entally, Kolkata, West Bengal 700014, India", "mobile": "+91 87773 54696" },
  { "name": "National Aircon", "address": "Kolkata, West Bengal, India", "mobile": "" },
  { "name": "Authorised Samsung Service Center", "address": "E Mall, Chittaranjan Ave, Kolkata, West Bengal 700072, India", "mobile": "+91 93304 68876" },
  { "name": "Rental Service India", "address": "34, Chittaranjan Ave, Bowbazar, Kolkata, West Bengal 700012, India", "mobile": "+91 91638 66044" },
  { "name": "Daichi service centre", "address": "75, Metcalfe St, Dharmatala, Taltala, Kolkata, West Bengal 700013, India", "mobile": "" },
  { "name": "Service on Wheel", "address": "435/1, Grand Trunk Rd, Kolkata, West Bengal 711101, India", "mobile": "+91 89815 35599" },
  { "name": "laptop doctor", "address": "E-mall, Shop No 326, Third Floor, Chittaranjan Ave, Kolkata, West Bengal 700072, India", "mobile": "+91 97171 81113" },
  { "name": "Asus Exclusive Service Centre", "address": "6A, Raja Subodh Mullick Square Rd, Kolkata, West Bengal 700012, India", "mobile": "+91 33 4030 1932" },
  { "name": "GoMechanic - Car Insurance Repair", "address": "1A, Mullick Bazar, Park Street area, Kolkata, West Bengal 700017, India", "mobile": "+91 83989 70970" },
  { "name": "Mitsubishi Ac Repair & Service Center", "address": "Park Street area, Kolkata, West Bengal 700016, India", "mobile": "" },
  { "name": "Modern Air Condition", "address": "157B, Lenin Sarani Rd, Kolkata, West Bengal 700013, India", "mobile": "" },
  { "name": "Ref Air Care", "address": "Kolkata, West Bengal, India", "mobile": "+91 70036 97226" }
];

const subagent1 = [
  { "name": "Urban Cool Ac Service", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "The Service Mart", "address": "Kolkata, West Bengal", "phone": "+91 98317 99757" },
  { "name": "M R Refrigeration", "address": "Abdul Halim Ln, Taltala, Kolkata", "phone": "+91 99031 19556" },
  { "name": "Su Laxmi Electronics Goods", "address": "Christopher Rd, Tangra, Kolkata", "phone": "+91 99036 75637" },
  { "name": "M/S. Shamim AC service", "address": "Ripon St, Kolkata", "phone": "N/A" },
  { "name": "Cooling control co.", "address": "Samsul Huda Rd, Ballygunge, Kolkata", "phone": "+91 82401 86623" },
  { "name": "Your AC Care", "address": "Kolkata, West Bengal", "phone": "+91 70034 54421" },
  { "name": "MAA TARA ENTERPRISE", "address": "Shibtala Ln, Kolkata", "phone": "+91 89612 44654" },
  { "name": "Mallick Enterprise", "address": "Ripon Ln, Taltala, Kolkata", "phone": "+91 74390 26282" },
  { "name": "RN Aircon", "address": "Kolkata, West Bengal", "phone": "+91 98308 56255" },
  { "name": "Gufran Cooling Solution", "address": "Kolkata, West Bengal", "phone": "+91 98754 34141" },
  { "name": "SM cooling control", "address": "Kolkata, West Bengal", "phone": "+91 99056 47330" },
  { "name": "Just Chill", "address": "Kolkata, West Bengal", "phone": "+91 79806 54071" },
  { "name": "Daga Autolek", "address": "Kolkata, West Bengal", "phone": "+91 89610 77413" },
  { "name": "Bokmap Services", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "AA AC Maintenance & Services", "address": "Kolkata, West Bengal", "phone": "+91 84203 64349" },
  { "name": "A2Z Service Solutions", "address": "Kolkata, West Bengal", "phone": "+91 89062 43423" },
  { "name": "O General Authorized Service Provider", "address": "Kolkata, West Bengal", "phone": "+91 62917 83324" },
  { "name": "AC service and repair", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "Cool&Cool Service Center", "address": "Howrah, West Bengal", "phone": "+91 70441 81980" },
  { "name": "Bhumi Appliances", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "Haier Service Care", "address": "Kolkata, West Bengal", "phone": "+91 94777 76470" },
  { "name": "Cosmos Refrigeration", "address": "Chatu Babu Ln, Kolkata", "phone": "+91 97351 63722" },
  { "name": "Voltas Customer care Service Center", "address": "Anandapur, Kolkata", "phone": "+91 1800 547 2040" },
  { "name": "Automanic", "address": "Dhapa, Kolkata", "phone": "+91 80170 98836" },
  { "name": "AC Repairing , Installation & Service", "address": "Howrah, Kolkata", "phone": "+91 80175 01032" },
  { "name": "Air On Time AC", "address": "Kolkata, West Bengal", "phone": "+91 80517 51127" },
  { "name": "M R cooling point.", "address": "Kolkata, West Bengal", "phone": "+91 91637 83324" },
  { "name": "RIO AIRCON LLP", "address": "Kolkata, West Bengal", "phone": "+91 98300 56950" },
  { "name": "Refrigeration Centre Pvt Ltd", "address": "Kolkata, West Bengal", "phone": "033 4001 5422" },
  { "name": "Golden Refrigeration Company", "address": "Kolkata, West Bengal", "phone": "+91 99038 66677" },
  { "name": "AC DC DRIVE REPAIR SERVICE", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "instant cooling care", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "KAZA NEARBY", "address": "Kolkata, West Bengal", "phone": "+91 82829 93311" },
  { "name": "Onida Service Center", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "S.K. REFRIGERATION", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "Haier Service Center Kolkata", "address": "Kolkata, West Bengal", "phone": "1800 419 9999" },
  { "name": "Voltas Samsung Hitachi Service", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "M S REFRIGERATION CENTER", "address": "Kolkata, West Bengal", "phone": "N/A" },
  { "name": "Unique Air Conditioning Enterprise", "address": "Kolkata, West Bengal", "phone": "+91 80 3542 6720" },
  { "name": "REBOOT IT ELECTRONICS PVT LTD", "address": "Esplanade, Kolkata", "phone": "+91 98310 66580" },
  { "name": "Carrier AC Service Center", "address": "34/156, Kolkata", "phone": "N/A" },
  { "name": "Koryo Service Centre Kolkata", "address": "4, Sree Aravinda, Kolkata", "phone": "N/A" },
  { "name": "R B COOLING POINT", "address": "Paul Lane, Salt Lake, Kolkata", "phone": "N/A" },
  { "name": "Cool made & co.", "address": "Ismail St, Entally, Kolkata", "phone": "+91 97480 23789" },
  { "name": "A/C TECHNICIAN", "address": "36, Circus Ave, Kolkata", "phone": "N/A" },
  { "name": "Hitachi Ac Service Center", "address": "2 Ballygunge Park, Kolkata", "phone": "N/A" }
];

const subagent2 = [
  { "name": "Anubhab'S Services", "address": "Briji Rd, Briji, Garia, Kolkata, West Bengal 700084", "phone": "+91 62912 85076" },
  { "name": "Shuvanktech AC Service", "address": "Pancha Sayar Rd, Pancha Sayar, Kolkata, West Bengal 700094", "phone": "+91 85360 49784" },
  { "name": "Coolfix solution", "address": "Phears Ln, near central matro, Bowbazar, Kolkata, West Bengal 700012", "phone": "+91 81006 02050" },
  { "name": "Aircool Enterprises Ac sarvice repair", "address": "Purbalok Main Rd, Purbalok, Mukundapur, Kolkata, West Bengal 700099", "phone": "+91 79789 47417" },
  { "name": "Perfect Air Condition Repair & Services", "address": "13H/1, Elliot Ln, Taltala, Kolkata, West Bengal 700016", "phone": "+91 89109 07281" },
  { "name": "Snap On Car AC Care", "address": "Shop no 8, Baisakhi, Baisakhi Island AG Market, Salt Lake, West Bengal 700091", "phone": "+91 98361 77863" },
  { "name": "Cooling point kolkata", "address": "Tiljala, Kolkata, West Bengal 700039", "phone": "+91 84347 28157" },
  { "name": "One Point Solutions", "address": "442, Kolkata, West Bengal 700015", "phone": "+91 70118 15645" },
  { "name": "Air Cooling Centre", "address": "Sector 1, Bidhannagar, Kolkata, West Bengal 700064", "phone": "+91 80015 86377" },
  { "name": "aircon & refrigeration service point", "address": "pubali garden, lane 2, Kolkata, West Bengal 700104", "phone": "+91 70039 63272" },
  { "name": "AirCon Service - AC Repairing Service Centre", "address": "Rajdanga Main Rd, Kasba, Kolkata, West Bengal 700107", "phone": "+91 81001 34315" },
  { "name": "Rup Aircondition", "address": "87, Brick Field Rd, Kasba, Kolkata, West Bengal 700039", "phone": "+91 97340 30627" },
  { "name": "CoolZone Refrigeration", "address": "34/1B, Kolkata, West Bengal 700012", "phone": "+91 82524 05113" },
  { "name": "Desire Multitech Solutions", "address": "1, Jannagar Rd, Park Circus, Kolkata, West Bengal 700017", "phone": "+91 95251 98387" },
  { "name": "Calcutta Cooling Center", "address": "168/M, Becharam Chatterjee Rd, Behala, Kolkata, West Bengal 700034", "phone": "+91 99035 94749" },
  { "name": "Sunny cooling and service", "address": "136/15/2, Netaji Sarak, Behala, Kolkata, West Bengal 700060", "phone": "+91 86200 05541" },
  { "name": "ROHIT REFRIGERATION & SERVICE", "address": "560, Raja Rammohan Roy Rd, Behala, Kolkata, West Bengal 700008", "phone": "+91 62907 22175" },
  { "name": "Bikash cooling point", "address": "Pashupati Bhattacharya Rd, Behala, Kolkata, West Bengal 700034", "phone": "+91 96745 36234" },
  { "name": "Weather Makers Air Conditioning Pvt Ltd", "address": "Diamond Harbour Rd, Behala, Kolkata, West Bengal 700034", "phone": "+91 33 2401 2222" },
  { "name": "RefCon Enterprise", "address": "Dr NG Saha Rd, Sarsuna, Kolkata, West Bengal 700061", "phone": "+91 85858 95095" },
  { "name": "Akash Cooling", "address": "Maharani Indira Devi Rd, Behala, Kolkata, West Bengal 700060", "phone": "+91 82404 57834" },
  { "name": "BARSHA ELECTRICAL & SERVICES", "address": "511, Raja Rammohan Roy Rd, Behala, Kolkata, West Bengal 700008", "phone": "+91 98313 76996" },
  { "name": "AS Services", "address": "C-25/19/20, Kolkata, West Bengal 700032", "phone": "+91 79985 49048" },
  { "name": "Airfix Cooling Service", "address": "Krishnapur, Kestopur, Kolkata, West Bengal 700102", "phone": "+91 89106 46539" },
  { "name": "Mono Cooling Centre", "address": "Krishnapur, Kestopur, Kolkata, West Bengal 700102", "phone": "+91 70034 87648" },
  { "name": "D.B Home Appliance Repairing Service", "address": "Chandiberia Main Rd, Kolkata, West Bengal 700102", "phone": "+91 93306 26604" }
];

const all_shops = [];
const seen_names = new Set();

function normalize_name(name) {
  return name.trim().toLowerCase();
}

existing_shops.forEach(s => {
  const norm = normalize_name(s.name);
  if (!seen_names.has(norm)) {
    all_shops.push(s);
    seen_names.add(norm);
  }
});

subagent1.forEach(s => {
  const norm = normalize_name(s.name);
  if (!seen_names.has(norm)) {
    all_shops.push({ name: s.name, address: s.address, mobile: s.phone === 'N/A' ? "" : s.phone });
    seen_names.add(norm);
  }
});

subagent2.forEach(s => {
  const norm = normalize_name(s.name);
  if (!seen_names.has(norm)) {
    all_shops.push({ name: s.name, address: s.address, mobile: s.phone === 'N/A' ? "" : s.phone });
    seen_names.add(norm);
  }
});

const final_shops = all_shops.slice(0, 90);
fs.writeFileSync('final_shops.json', JSON.stringify(final_shops, null, 2));
console.log(`Saved ${final_shops.length} unique shops to final_shops.json`);
