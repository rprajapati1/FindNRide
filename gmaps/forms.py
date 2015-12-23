from django import forms

class GoogleMapsForm(forms.Form):
    location = forms.CharField(label='Location:', max_length=100)
    address1 = forms.CharField(label='Address 1:', max_length=100)
    address2 = forms.CharField(label='Address 2:', max_length=100)
    city = forms.CharField(label='City:', max_length=100)
