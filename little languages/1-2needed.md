## What Is Needed
Our SCN requires only three (3) main elements:
1. name
2. match captures
3. string generation

### Name
We need to match-up *grammar* rules to *fabrication* rules.

We'll do this by using the rule name.

In this SCN design, *fabricator* rules must have *exactly* the same name as their corresponding *grammar* rules.  There must be a 1:1 match.  There must be exactly the same number of *fabrictor rules* as there are *grammar rules*.

Note that most other PEG-based libraries avoid this issue completely by conflating the *grammar* rules with *semantic* code.  This practice tends to obfuscate the simplicity of the main grammar with details that are only loosely related to the *grammar*.

I believe that the Ohm decision to separate *grammar* rules from *semantics* code is the right decision.  

We'll refine Ohm's decision by building an SCN to handle  a specific variant of semantics processing - transpilling by creating strings by formatting and rearranging the pieces of text matched by the Ohm pattern-matching engine.  This refinement is intended to handle 80% of the use-cases encountered in practice.  We simply ignore and punt to Javascript, all of the rest of the more complicated use-cases.

## Match captures
## String generation
