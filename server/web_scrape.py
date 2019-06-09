#!/usr/bin/env python3
# -*- coding: <utf-8> -*-
from os.path import expanduser
import json
import bs4
from datetime import datetime
from requests import get
from time import time
from math import floor
from re import compile

PATH = expanduser('~/Code/js/cinco_minutos/server/')

# order
o = ['Indicative', 'Subjunctive', 'Imperative', 'Progressive', 'Perfect', 'Perfect Subjunctive']
# suborder
so = {
    'Indicative': ['Present','Preterite','Imperfect','Conditional','Future'],
    'Subjunctive': ['Present','Imperfect (-ra)','Imperfect (-se)','Future'],
    'Imperative': ['Affirmative','Negative'],
    'Progressive': ['Present','Preterite','Imperfect','Conditional','Future'],
    'Perfect': ['Present','Preterite','Past','Conditional','Future'],
    'Perfect Subjunctive': ['Present', 'Past', 'Future']
}

class Conjugation:
    '''Conjugation() -> Conjugation class
    Class for finding verb conjugations from SpanishDict and WordReference'''

    def __init__(self):
        self.offline, self.verb = False, None
        self.conj = False
        self.meaning = ''

    def _get(self, link:str):
        self.html = get(link)

    def _online_get(self, verb: str, site: str):
        '''self._online_get(verb, site) -> part 1 of web-scraping method
        makes requests to server and web-scrapes into messy lists
        part one of finding conjugation - needs to pass through if statement in calling method
        Uses bs4 and requests'''
        site = site.lower()
        assert site == "spanishdict" or site == "wordreference"

        if site == 'spanishdict': 
            try: self._get("http://www.spanishdict.com/conjugate/{}".format(verb))
            except:  # any exception gets handled
                self.offline = True # assumes a network problem
                return [] # returns empty list
            self.offline = False
            soup = bs4.BeautifulSoup(self.html.content, 'html.parser')
            content = []
            for conj in soup.find_all(class_='vtable-word-text'):
                # removes tag class into str if not already str and joins list together
                content.append(''.join([each if not isinstance(each,bs4.element.Tag) else \
                each.get_text() for each in list(conj.children)]))
            # web-scrape definition of verb
            try:
                content.append(list(soup.find(class_='quickdef1Desktop--1CTDp'))[0].get_text())
            except AttributeError:
                # print("TypeError at spanishdict webscrape!")
                content.append("")  # if spanishdict re-directed to some weird page
            except TypeError: content.append("")
            # makes sure verb displayed on website is same as args
            try: self.verb = soup.find(class_='headwordDesktop--2XpdH').get_text()
            except AttributeError: return []
            # print("content bef parse: {}".format(content));
            return content # if all goes well, returns a proper list
            
        else:
            try:
                # 2 different websites for conjugation and definition
                self._get('http://www.wordreference.com/es/en/translation.asp?spen={}'.format(verb))
                meaning = self.html
                self._get("http://www.wordreference.com/conj/EsVerbs.aspx?v={}".format(verb))
            except: # any exception gets handled
                self.offline = True # assumes a network problem
                return [] # returns empty list
            self.offline = False
            # makes 2 bs4 objects
            soup = bs4.BeautifulSoup(self.html.content, 'html.parser')
            soup2 = bs4.BeautifulSoup(meaning.content, 'html.parser')
            content = []
            # class neoConj is all Indicative, Subjunctive, etc
            for conj in soup.find_all(class_='neoConj'):
                content.extend([each if not isinstance(each,bs4.element.Tag) else each.get_text() \
                for each in list(conj.find_all('td'))])
            # progressive and perfects only list participles
            # add padding of len 15 to get calling method to accept len of content
            content.extend(['' for i in range(15)])
            try: # finds participles and does some processing later
                # weird style for participles
                content.append([each if not isinstance(each,bs4.element.Tag) else each.get_text() \
                for each in list(soup.find('td', {'style':"vertical-align:top;padding-left: 4em;"}).children)])
                # takes first element of split (,)
                content[-1] = ''.join(['  ' if each == '' else each for each in content[-1]]).split('  ')[1].split(', ')[0]
            except AttributeError: return [] # if doesn't exist because of some weird re-direct
            meanings = []
            # classes even and odd are some weird wordReference organization of definitions
            for td in soup2.find_all(class_='even')+soup2.find_all(class_='odd'):
                # find class within first class
                if td.find(class_='ToWrd') is not None:
                    tagAndStr = list(td.find(class_='ToWrd').children)
                    if isinstance(tagAndStr[0], bs4.element.Tag): # if first element is tag
                        meanings.append(tagAndStr[1]) # then get second element
                    else: meanings.append(tagAndStr[0])
            # last element is definition
            content.append(', '.join(meanings[:5])) # join together all meanings, with max of 5
            if not len(content[-1]): # sometimes definitions appear weirdly
                meaning = soup2.find(id='clickableHC')
                try: meaning = list(meaning.find_all(text = compile('to'))) # find all with "to"
                except AttributeError: meaning = ""
            # odd html stuff - makes sure verb on webpage is same as args
            self.verb = soup.find('span', id='noteImport2').next_sibling.next_sibling.get_text()
            return content
        return [] # if not either ifs then it is weird and return empty list

    def _online_parse(self, verb: str, site: str, content: list):
        '''self._online_parse(verb, site, content) -> part 2 of web-scraping method
        reorganizes and reindexes unorganized content list into a good list'''
        if site.lower() == 'spanishdict':
            # first separate by top-level o - Indicative, Subjuctive, etc
            unformatted = {
                o[0]: content[:30],
                o[1]: content[30:54],
                o[2]: content[54:64],
            }
            conjugation = {category: {} for category in ["Indicative", 'Subjunctive', 'Imperative']} # create blank dicts
            for current in unformatted:
                for index in range(len(so[current])):
                    # skips over indexes and reorganizes from Yo-starting lists to Present-starting lists
                    # como, comí, comía, comería, comeré  ->  como, comes, come, comemos, coméis, comen
                    conjugation[current][so[current][index]] = [unformatted[current][conj].lower() for conj\
                     in range(index, len(unformatted[current]), len(so[current]))]  # skip by length of sub-category
            conjugation["Present Participle"] = content[64].split(" ")[-1]
            conjugation["Past Participle"] = content[-2].split(" ")[-1]
            
        elif site.lower() == 'wordreference':
            refl = verb[-2:] == 'se' and content[0][:3] == 'me '
            #reflexive or not - important in adding estar conjugations to progressive
            content = [item.lower() for item in content]
            # Gigantic unorganized list in need of better organzing
            # Dict comp and list comp is used when possible
            conjugation = {
                o[0]: {
                    so[o[0]][0]: content[:6],
                    so[o[0]][1]: content[14:20], 
                    so[o[0]][2]: content[7:13],
                    so[o[0]][3]: content[28:34], 
                    so[o[0]][4]: content[21:27]
                },
                o[1]: {
                    so[o[1]][0]: content[63:69], 
                    # separate -ra and -se imperfect subjunctive conjugations
                    so[o[1]][1]: [conj.split(' o ')[0] for conj in content[70:76]],
                    # also might use "u" to serpate as well as "o" - really just many if and elif statements in list comp
                    so[o[1]][2]: [conj.split(' u ')[1] if len(conj.split(' o ')) == 1 and \
                                len(conj.split(' u ')) == 2 else conj.split(' o ')[1] if len(conj.split(' o ')) == 2 else conj \
                                for conj in content[70:76]], 
                    so[o[1]][3]: content[77:83]
                },
                o[2]: {
                    so[o[2]][0]: [elem[1:-1] for elem in content[106:111]],
                    so[o[2]][1]: [elem[1:-1] for elem in content[113:118]]
                },
                "Present Participle": content[-2],
                "Past Participle": content[36].split(" ")[-1]
            }
        #print(site+" present part - " + conjugation["Present Participle"])
        #print("past part - " + conjugation["Past Participle"])
        #print(conjugation)
        
        # meaning is last index
        try:
            self.meaning = content[-1]
        except IndexError: print("ERROR! {}".format(content))
        return conjugation

    def find(self, verb: str):
        '''self.find(verb) -> method for finding conjugation in list
        calls _online_get and _online_parse
        tries to find conjugation in file first if offline mode is on and selected to use
        otherwiese will iterate and use first selected source by user if possible'''
        self.conj = {}
        self.meaning = ""
        for site in ['wordreference', 'spanishdict']: # iterate through each site
            # first do request handling
            content = self._online_get(verb, site.lower())
            # print("online get done!")
            # make sure that len if correct and conjugation is accurate
            
            if len(content) != 143 or (verb[-2:] == 'se' and content[0][:3] != 'me '):
                #print("length if - {}".format(len(content)))
                #try: print("se if - {}".format(verb[-2:] == 'se' and content[0][:3] != 'me '))
                #except IndexError: pass
                self.conj[site] = None
                #print("Search term and result do not correlate!")
            else:
                #print("passed test!")
                self.conj[site] = self._online_parse(verb, site.lower(), content)

    def __str__(self):
        '''self.__str__() -> method for turning list into strings
        used for conjugation and prettifying list'''
        if self.conj == {"spanishdict": None, "wordreference": None}: return None
        strConj = ''
        for site in self.conj:
            strConj += '\n{}\n'.format(site.upper())
            for dct in self.conj[site]:
                strConj += '\n{}\n'.format(dct.upper())
                for lst in self.conj[site][dct]:
                    strConj += "{:12} {}\n".format(lst + ':', ', '.join(self.conj[site][dct][lst]))
        return strConj

def all_download():
    '''all_download() -> method for downloading all verbs and conjugations
    Finds gigantic list of all verbs from cooljugator.com
    Takes around 5 hours to complete method - only attempt on good Wifi and battery'''
    conj = Conjugation()
    startT = time()
    try: html = get("https://cooljugator.com/es/list/all")
    except:
        print("I'm offline!\nPlease Connect To WiFi and Try Again.")
        return
    soup = bs4.BeautifulSoup(html.content, 'html.parser')
    # content is parsed list of all verbs - some are archaic and no longer used
    verb_list = [list(verb.children)[0].get_text() for verb in list(soup.find('div', \
    class_='ui segment stacked').children)[0].children][:-1]
    print('Array retreived in {:.2f}sec'.format(time() - startT))
    
    startT = time()
    _f = open(PATH+"fullSearch.json", 'a+')
    _q = open(PATH+"quickSearch.json", 'a+')
    _v = open(PATH + "verbs.json", 'a+')
    _f.seek(0, 0)
    _q.seek(0, 0)
    _v.seek(0, 0)
    f_write = json.load(_f)
    q_write = json.load(_q)
    v_write = json.load(_v)

    _i = open(PATH + "index.json", "r+")
    s = json.load(_i)['ind']  # start index
    start = s
    _i.seek(0,0)
    try:
        for i in range(start, len(verb_list)):
            print('{:15} ---{:5}/{:5} --- {:.2f}m'.format(verb_list[i], i, len(verb_list), (time()-startT)/60))
            # Makes request
            conj.find(verb_list[i])
            #print("Is empty conj: {}".format(conj.conj == {"spanishdict": None, "wordreference": None}))
            #print("Meaning is None: {}".format(conj.meaning==""))
            if conj.conj != {"spanishdict": None, "wordreference": None}:
                writeConj = conj.meaning if conj.meaning != "" else None
                if writeConj is not None: writeConj = "to "+writeConj.strip().split("to")[-1].strip()
                v_write[conj.verb] = { # append dict obj
                    'verb': conj.verb,
                    'definition': writeConj,
                    'reflexive': True if conj.verb[-2:] == 'se' else False,
                    'spanishdict': conj.conj['spanishdict'],
                    'spanishdictLink': "http://www.spanishdict.com/conjugate/"+conj.verb,
                    'wordreference': conj.conj['wordreference'],
                    'wordreferenceLink': "http://www.wordreference.com/es/en/translation.asp?spen="+conj.verb
                }
                strConj = ''
                for site in conj.conj:
                    if conj.conj[site] is None: continue
                    for dct in conj.conj[site]:
                        if isinstance(conj.conj[site][dct], str): f_write[conj.conj[site][dct]] = conj.verb
                        else:
                            for lst in conj.conj[site][dct]:  
                                for thisConj in conj.conj[site][dct][lst]:
                                    f_write[thisConj] = conj.verb
                # Write only first defintion
                if conj.meaning != "": q_write[conj.verb] = "to "+conj.meaning.split(",")[0].strip().split("to")[-1].strip()
            elif conj.offline:
                print("WiFi connection terminated. Saving to files...")
                break
            else: print("{:10}Skipping...".format(""))
            s = i
    except KeyboardInterrupt: print("Session interrupted.")
    finally:
        _i.truncate(0)
        _f.truncate(0)
        _q.truncate(0)
        _v.truncate(0)
        json.dump(f_write, _f, ensure_ascii=False)
        print("fullSearch.json written")
        json.dump(q_write, _q, indent=2, ensure_ascii=False)
        print("quickSearch.json written")
        json.dump(v_write, _v, ensure_ascii=False)
        print("verbs.json written")
        dct = {'ind': s}
        json.dump(dct, _i, indent=2, ensure_ascii=False)
        print("index.json written")
        _f.close()
        _q.close()
        _v.close()
        _i.close()
        now = datetime.now()
        mins = (time() - startT) / (s - start) / 60 #each in mins
        mins *= (len(verb_list)-s) # total left
        print("EST Complete: {}h {}m".format(int(mins//60), int(floor(mins)%60)))
        print("End script @ {}:{}".format(now.hour,now.minute))

def test_Conjugation():
    conj = Conjugation()
    conj.find(input("Input a verb: ").lower())
    print(str(conj))

if __name__ == "__main__":
    all_download()
