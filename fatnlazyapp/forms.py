from django import forms

class GoogleForm(forms.Form):
    location = forms.CharField(widget=forms.TextInput,initial='Eg. Berkeley, Oakland, San Francisco etc.',label = 'location', required=True)
    location.widget.attrs.update({'id' : 'form-control'})
    
