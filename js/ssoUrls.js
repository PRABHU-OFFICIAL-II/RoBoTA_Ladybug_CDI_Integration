let iicsMap = [
  {
    "REGION_ID": "AWS-APAC",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicspodapj_1/0oa1fp97y61v4TIUL1d8/aln1fp9hdfwl08TO51d8"
  },
  {
    "REGION_ID": "AWS-JAPAN",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawsapne_1/0oa1mrvuzwbMKNToQ1d8/aln1mrw0le4phcaYy1d8"
  },
  {
    "REGION_ID": "AWS-CAN",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawscanada_1/0oa1ikqhhzz4tdNXw1d8/aln1ikqpmzxhGiEge1d8"
  },
  {
    "REGION_ID": "AWS-EMEA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicspodemea_1/0oa1fvf1g8aeoHY8a1d8/aln1fvf4yoiZ6yTaY1d8"
  },
  {
    "REGION_ID": "AWS-ICINQ1",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawsicinq1_1/0oa1ikqtcw1Q9KgXR1d8/aln1ikr2z0miFzsn61d8"
  },
  {
    "REGION_ID": "AWS-PREV",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawspreview_1/0oa1ikqikswCoiDLb1d8/aln1ikqtbqwj8dmFU1d8"
  },
  {
    "REGION_ID": "AWS-STAGING",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawsstaging_1/0oa1ikquzucJ7MGzt1d8/aln1ikr66t4rwg7ta1d8"
  },
  {
    "REGION_ID": "AWS-UK",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsawsukpod_1/0oa1k20bdiyGwViRs1d8/aln1k20lmer5Z3VUo1d8"
  },
  {
    "REGION_ID": "AWS-USA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicspodsus_1/0oa1fveza80zqaXRE1d8/aln1fvf2euld8yLd11d8"
  },
  {
    "REGION_ID": "AZU-APAUC",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazureapau_1/0oa1km4kljpxGQ4k01d8/aln1km4qvdgF0eq2x1d8"
  },
  {
    "REGION_ID": "AZU-SNGP",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazureapse_1/0oa1j1830buvtpSdj1d8/aln1j18d7bpyyc6Nc1d8"
  },
  {
    "REGION_ID": "AZU-EMEA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazureemea_1/0oa1j1878dadX9FVZ1d8/aln1j18e2z6JkCHWL1d8"
  },
  {
    "REGION_ID": "AZU-ME",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazureemse_1/0oa1mrvx9clp6aZF41d8/aln1mrw1zk0prItPO1d8"
  },
  {
    "REGION_ID": "AZU-APAC",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazurentt_1/0oa1ikqvj1plkwndU1d8/aln1ikr3uo0oncKtW1d8"
  },
  {
    "REGION_ID": "AZU-STAGING",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazurestaging_1/0oa1iwll74kGO7QYo1d8/aln1iwlvxbqZIArbi1d8"
  },
  {
    "REGION_ID": "AZU-USA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsazureus_1/0oa1ikqth54yWkUuG1d8/aln1ikr4u6jaeTwde1d8"
  },
  {
    "REGION_ID": "C360-US",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsc360us_1/0oa1ikqsqo5jnSWQx1d8/aln1ikr49c29OfVoO1d8"
  },
  {
    "REGION_ID": "GCP-EMEA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsgcpemea_1/0oa1mzapjogTQvwPQ1d8/aln1mzasavrLmDBUI1d8"
  },
  {
    "REGION_ID": "GCP-Staging",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsgcpstaging_1/0oa1kxtkhqwL3GebF1d8/aln1kxtryrhf9lgZi1d8"
  },
  {
    "REGION_ID": "GCP-USA",
    "ssoUrl": "https://informatica.okta.com/home/informatica_iicsgcpus_1/0oa1ikqvnkbp8aT7p1d8/aln1ikr5nidGJqGAY1d8"
  }
]

function getSsoUrl(iREGION_ID) {
  let sso = iicsMap.filter(sso => sso.REGION_ID = iREGION_ID);
  return sso.length = 1 ? sso[0].ssoUrl : null;
}
