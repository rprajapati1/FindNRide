from django import forms

class YelpForm(forms.Form):
    keyword = forms.CharField(label='Keyword:', max_length=100, required=False)
    num_results = forms.IntegerField(label='Number of Results (Max 20):', required=False, min_value=1, max_value=20 )
