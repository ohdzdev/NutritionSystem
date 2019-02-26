this page needs to facilitate printing off two sets of pages that will be printed onto label pages

specifically there are
1. Meat Labels (example in dir)
    * Diets are seperated by a food type and a black bar to make it obvious.
    * There are 3 columns on a page with 11 rows
    * margins look to be .25 inches on sides with .5 inches vertically
    * there are 4 lines of data as such:
        1. **NUM**(comma sep) **UOW** (unit of weight) **FOOD NAME**
        2. **DIET NAME**
        3. **ANIMAL**
        4. **DATE** (date prepped for) ***SPECIES*** #**DIET NUMBER**
    * seperator consists of two lines centered compared to the typical 4 data lines above
        1. **BLANK BLACK BAR**
        2. **FOOD NAME**


2. Diet Labels (example in dir)
    * there are 4 lines of data as such:
        1. **DEPT AREA**
        2. **DIET NAME**
        3. **SPECIES NAME**
        4. **DATE**(date prepped for) #**DIET NUMBER**


###AC
1. each line must truncate at a certain number of characters, I noticed certain diet names were too long causing issues with printing
2. must have option for saving
3. page flow must either be automatic like current flow, or allow them control of if they want to print or not by previewing


Stretch
4. attaching to an email via mailto:: link (optional)
5. allow them to print by department?
6. allow them to generate a print off a single diet or range of diet numbers in case labels got goofed / lost


tools
1. https://material-ui.com/system/display/
2. https://www.npmjs.com/package/react-to-print
